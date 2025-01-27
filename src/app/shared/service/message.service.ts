import { DestroyRef, inject, Injectable } from '@angular/core';
import { Conversation, Message, User } from '../models';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  URL = 'http://localhost:3003/conversations';
  destroyRef = inject(DestroyRef);
  http = inject(HttpClient);
  authenticationService = inject(AuthenticationService);
  private readonly date: string;

  constructor() {
    this.date = new Date().toLocaleString();
  }

  createConversation(sender: User, receiver: User): Observable<object> {
    return this.fetchConversations().pipe(
      take(1),
      switchMap(result => {
        const conversationId = result.length + 1;
        const conversation: Conversation = { id: conversationId, firstUser: sender.userName, secondUser: receiver.userName, messages: [] };
        return this.http.post(this.URL, conversation);
      })
    );
  }

  sendMessage(conversationId: number, user: string, content: string, currentMessages: Message[]):Observable<Conversation> {
    const message: Message = { user: user, message: content, time: this.date };
    const conversationUrl = this.URL + `/${conversationId}`;
    const updateMessages = [...currentMessages, message];
    return this.http.patch(conversationUrl, { messages: updateMessages }) as Observable<Conversation>;
  }

  fetchConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(this.URL);
  }
}
