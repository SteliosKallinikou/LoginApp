import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { JsonPipe, Location, NgClass } from '@angular/common';
import { AuthenticationService } from '../shared/service/authentication.service';
import { UserDataService } from '../shared/service/user-data.service';
import { Conversation, Message, User } from '../shared/models';
import { MessageService } from '../shared/service/message.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput } from '@angular/material/input';
import { interval, switchMap, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConversationComponent } from '../conversation/conversation.component';

@Component({
  selector: 'app-message',
  imports: [MatIcon, MatIconButton, NgClass, FormsModule, MatInput, ReactiveFormsModule, MatFormField, JsonPipe, ConversationComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent implements OnInit {
  authenticationService = inject(AuthenticationService);
  userService = inject(UserDataService);
  messageService = inject(MessageService);
  location = inject(Location);
  user = this.authenticationService.authenticatedUser;
  availableUsers: User[] = [];
  openConversations: Conversation[] = [];
  conversation: Conversation = {} as Conversation;
  messages: Message[] = [] as Message[];

  ngOnInit(): void {
    this.userService.user.subscribe(data => {
      this.availableUsers = data;
    });

    this.messageService.fetchConversations().subscribe(data => {
      data.find(res => {
        if (res.secondUser === this.authenticationService.userName || res.firstUser === this.authenticationService.userName) {
          this.messages = res.messages;
          console.log(this.messages);
          this.openConversations.push(res);
        }
      });
    });
  }

  goBack() {
    this.location.back();
  }

  selectedConversation(selection: User): void {
    this.openConversations.find(res => {
      if (res.secondUser === selection.userName) {
        this.openConversation(res.id);
      }
      if (this.openConversations) {
        this.messageService.createConversation(this.user, selection).subscribe();
      }
    });
  }

  openConversation(id: number): void {
    this.conversation = this.openConversations[id];
  }
}
