import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Location, NgOptimizedImage } from '@angular/common';
import { AuthenticationService } from '../shared/service/authentication.service';
import { UserDataService } from '../shared/service/user-data.service';
import { Conversation, Message, User } from '../shared/models';
import { MessageService } from '../shared/service/message.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConversationComponent } from '../conversation/conversation.component';
import { MatCardImage } from '@angular/material/card';

@Component({
  selector: 'app-message',
  imports: [MatIcon, MatIconButton, FormsModule, ReactiveFormsModule, ConversationComponent, MatCardImage, NgOptimizedImage],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent implements OnInit {
  authenticationService = inject(AuthenticationService);
  userService = inject(UserDataService);
  messageService = inject(MessageService);
  destroyRef = inject(DestroyRef);
  location = inject(Location);
  user = this.authenticationService.authenticatedUser;
  availableUsers: User[] = [];
  openConversations: Conversation[] = [];
  conversation: Conversation = {} as Conversation;
  messages: Message[] = [] as Message[];

  ngOnInit(): void {
    this.userService.user.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.availableUsers = data;
    });

    this.messageService
      .fetchConversations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        data.find(res => {
          if (res.secondUser === this.authenticationService.userName || res.firstUser === this.authenticationService.userName) {
            this.messages = res.messages;
            this.openConversations.push(res);
          }
        });
      });
  }

  goBack(): void {
    this.location.back();
  }

  selectedConversation(selection: User): void {
    const conversation = this.openConversations.find(res => selection.userName === res.firstUser);
    if (conversation) {
      this.conversation = conversation;
      this.messages = conversation.messages;
    } else {
      this.messageService.createConversation(this.authenticationService.authenticatedUser, selection).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
        this.openConversations.push(data);
      });
    }
  }

  openConversation(id: number): void {
    this.conversation = this.openConversations[id];
    this.messages = this.openConversations[id].messages;
  }
}
