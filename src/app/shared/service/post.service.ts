import { DestroyRef, inject, Injectable } from '@angular/core';
import { User } from '../models';
import { Post } from '../models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  http = inject(HttpClient);
  URL = 'http://localhost:3002/posts';
  destroyRef = inject(DestroyRef);

  createPost(user: User, text: string): void {
    this.post.subscribe(post => {
      const newId = post.length + 1;
      let date = new Date();
      const newPost: Post = { belongsTo: user, content: text, id: newId, date: date.toLocaleString() };
      this.http.post(this.URL, newPost).subscribe(data => console.log(data));
    });
  }

  get post(): Observable<Post[]> {
    return this.http.get<Post[]>(this.URL);
  }
}
