import { Message } from './message';

export interface Conversation {
  id: number;
  firstUser: string;
  secondUser: string;
  messages: Message[];
}
