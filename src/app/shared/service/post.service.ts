import { DestroyRef, inject, Injectable } from '@angular/core';
import {Comment, User} from '../models';
import { Post } from '../models';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  http = inject(HttpClient);
  URL = 'http://localhost:3002/posts';
  destroyRef = inject(DestroyRef);
  private readonly date: string;

  constructor() {
    this.date = new Date().toLocaleString()
  }

  createPost(user: User, text: string): void {
    this.post.subscribe(post => {
      const newId = post.length + 1;
      const newPost: Post = { belongsTo: user, content: text, id: newId, date: this.date, likes: 0, comments: [] };
      this.http.post(this.URL, newPost).subscribe(data => console.log(data));
    });
  }

  likePost(currentPost: Post) {
    const currentUrl = this.URL + `/${currentPost.id}`;
    const newPost: Post = { ...currentPost, likes: ++currentPost.likes };
    this.http.put(currentUrl, newPost).subscribe(data => console.log(data));
  }

  createComment(user: string, text: string, userPost:Post){
    const postTo= this.URL+`/${userPost.id}`;
    const newComment:Comment={content:text,createdBy:user,date:this.date};
    userPost.comments.push(newComment)
    this.http.put(postTo,userPost).subscribe(data=>console.log(data));
  }

  get post(): Observable<Post[]> {
    return this.http.get<Post[]>(this.URL);
  }

  get comments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.URL)
  }

}
