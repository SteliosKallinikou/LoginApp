import {Component, DestroyRef, inject, input} from '@angular/core';
import { NgClass } from '@angular/common';
import { AuthenticationService } from '../shared/service/authentication.service';
import { MessageService } from '../shared/service/message.service';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { Conversation, Message } from '../shared/models';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-conversation',
  imports: [NgClass, MatFormField, MatIcon, FormsModule, MatIconButton, MatInput],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss',
})
export class ConversationComponent {
  authenticationService = inject(AuthenticationService);
  messageService = inject(MessageService);
  destroyRef=inject(DestroyRef)
  textMessage: string = '';
  messages = input.required<Message[]>();
  conversation = input.required<Conversation>();

  sendMessage() {
    this.messageService
      .sendMessage(this.conversation().id, this.authenticationService.userName, this.textMessage, this.messages())
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
        this.messages().push(res.messages[res.messages.length - 1]);
      });
  }
}
