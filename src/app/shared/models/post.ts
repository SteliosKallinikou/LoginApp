import { User } from './user';
import { Comment } from './comment';

export interface Post {
  belongsTo: User;
  content: string;
  id: number;
  date: string;
  likes: number;
  comments: Comment[];
  image: string;
}
