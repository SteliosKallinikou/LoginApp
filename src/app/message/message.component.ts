import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { AuthenticationService } from '../shared/service/authentication.service';
import { UserDataService } from '../shared/service/user-data.service';
import { Conversation, User } from '../shared/models';
import { MessageService } from '../shared/service/message.service';

@Component({
  selector: 'app-message',
  imports: [MatIcon, MatIconButton, NgClass],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  authenticationService = inject(AuthenticationService);
  userService = inject(UserDataService);
  messageService = inject(MessageService);
  user = this.authenticationService.authenticatedUser;
  availableUsers: User[] = [];
  openConversations: Conversation[] = [];
  conversation: Conversation = {} as Conversation;

  constructor() {
    this.userService.user.subscribe(data => {
      this.availableUsers = data;
    });
    this.messageService.fetchConversations().subscribe((data: Conversation[]) => (this.openConversations = data));
  }

  goBack() {
    //this.messageService.sendMessage(1,this.user.id,"this").subscribe(data=>console.log(data))
  }

  selectedConversation(selection: User): void {
    this.openConversations.find(res => {
      if (res.secondUser === selection.userName) {
        this.openConversation(res.id);
      }
      if (this.openConversations) {
        console.log('here');
        this.messageService.createConversation(this.user, selection).subscribe();
      }
    });
  }

  sendMessage(content: string): void {
    console.log(this.conversation);
    this.messageService.sendMessage(this.conversation.id, this.authenticationService.userName, content);
  }

  openConversation(id: number): void {
    this.conversation = this.openConversations[id - 1];
  }
}
