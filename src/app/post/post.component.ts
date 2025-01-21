import { Component, DestroyRef, inject, input } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { PostService } from '../shared/service/post.service';
import { Comment, Post, User } from '../shared/models';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe, NgOptimizedImage } from '@angular/common';
import { AuthenticationService } from '../shared/service/authentication.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-post',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatCardTitle,
    MatCardSubtitle,
    ReactiveFormsModule,
    FormsModule,
    NgOptimizedImage,
    MatCardImage,

  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  postService = inject(PostService);
  authenticationService = inject(AuthenticationService);
  destroyRef = inject(DestroyRef);
  user = input.required<User>();
  postContent = input.required<string>();
  date = input.required<string>();
  post = input.required<Post>();
  canComment = false;
  comments: Comment[] = [];
  commentContent = '';

  likePost(): void {
    this.postService.likePost(this.post());
  }
  openComments(): void {
    this.canComment = true;
    this.postService.post.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.comments = data[this.post().id - 1].comments;
    });
  }

  shareComment(): void {
    this.postService.createComment(this.authenticationService.authenticatedUser, this.commentContent, this.post());
  }
}
