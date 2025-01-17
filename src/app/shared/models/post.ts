import { User } from './user';

export interface Post {
  belongsTo: User;
  content: string;
  id: number;
  date: string;
}
