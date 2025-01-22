import { DestroyRef, inject, Injectable } from '@angular/core';
import { Comment, User } from '../models';
import { Post } from '../models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

  createPost(user: User, text: string,image=''): void {
    console.log(image)
    this.post.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(post => {
      const newId = post.length + 1;
      const newPost: Post = { belongsTo: user, content: text, id: newId, date: this.date, likes: 0, comments: [],image:image};
      this.http.post(this.URL, newPost).subscribe(data => console.log(data));
    });
  }

  likePost(currentPost: Post):void {
    const currentUrl = this.URL + `/${currentPost.id}`;
    const newPost: Post = { ...currentPost, likes: ++currentPost.likes };
    this.http
      .put(currentUrl, newPost)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => console.log(data));
  }

  createComment(user: User, text: string, userPost: Post):void {
    const postTo = this.URL + `/${userPost.id}`;
    const newComment: Comment = { content: text, createdBy: user.userName, date: this.date };
    userPost.comments.push(newComment);
    this.http
      .put(postTo, userPost)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => console.log(data));
  }

  postUpdate(user: User, post: Post):void {
    this.userDataService.user.subscribe(data =>
      data.find(res => {
        if (user.id === res.id) {
          this.http.patch(this.URL + `/${post.id}`, { belongsTo: res }).subscribe();
        }
      })
    );
  }

  get post(): Observable<Post[]> {
    return this.http.get<Post[]>(this.URL);
  }
}
