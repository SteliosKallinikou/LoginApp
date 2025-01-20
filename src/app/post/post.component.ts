import { Component, inject, input } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { PostService } from '../shared/service/post.service';
import { Post } from '../shared/models';

@Component({
  selector: 'app-post',
  imports: [MatCard, MatCardHeader, MatCardContent, MatCardActions, MatButton, MatCardTitle, MatCardSubtitle],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  postService = inject(PostService);
  user = input.required<string>();
  postContent = input.required<string>();
  date = input.required<string>();
  post = input.required<Post>();

  likePost() {
    this.postService.likePost(this.post());
  }
}
