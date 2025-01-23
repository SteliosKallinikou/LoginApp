import { DestroyRef, inject, Injectable } from '@angular/core';
import { Comment, User } from '../models';
import { Post } from '../models';
import { HttpClient } from '@angular/common/http';
import {EMPTY, map, Observable, switchMap, take} from 'rxjs';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  http = inject(HttpClient);
  URL = 'http://localhost:3002/posts';
  destroyRef = inject(DestroyRef);
  userDataService = inject(UserDataService);
  private readonly date: string;

  constructor() {
    this.date = new Date().toLocaleString();
  }

  createPost(user: User, text: string, image = ''):Observable<object> {
    return this.fetchPost().pipe(
      take(1),
      map(posts => {
        const newId = posts.length + 1;
        const newPost: Post = {
          belongsTo: user,
          content: text,
          id: newId,
          date: this.date,
          likes: 0,
          comments: [],
          image: image,
        };
        return newPost;
      }),
      switchMap(newPost => this.http.post(this.URL, newPost))
    );
  }

  likePost(currentPost: Post):Observable<object> {
    const currentUrl = this.URL + `/${currentPost.id}`;
    const updatedPost: Post = { ...currentPost, likes: currentPost.likes + 1 };
    return this.http.put(currentUrl, updatedPost);
  }

  createComment(user: User, text: string, userPost: Post):Observable<object> {
    const postTo = this.URL + `/${userPost.id}`;
    const newComment: Comment = { content: text, createdBy: user.userName, date: this.date };
    const updatedPost = { ...userPost, comments: [...userPost.comments, newComment] };
    return this.http.put(postTo, updatedPost);
  }

  postUpdate(user: User, post: Post):Observable<object> {
    return this.userDataService.user.pipe(
      take(1),
      map(data => data.find(res => user.id === res.id)),
      switchMap(foundUser => {
        if (foundUser) {
          return this.http.patch(this.URL + `/${post.id}`, { belongsTo: foundUser });
        }
        return EMPTY;
      })
    );
  }

  followUser(currentUser: User):Observable<object> {
    const updatedUser: User = { ...currentUser, followers: currentUser.followers + 1 };
    return this.userDataService.changeUserDetails(updatedUser, currentUser);
  }

  fetchPost(): Observable<Post[]> {
    return this.http.get<Post[]>(this.URL);
  }
}
