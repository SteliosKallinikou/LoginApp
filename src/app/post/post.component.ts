import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
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
import { NgOptimizedImage } from '@angular/common';
import { AuthenticationService } from '../shared/service/authentication.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatBadge } from '@angular/material/badge';

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
    MatBadge,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  postService = inject(PostService);
  authenticationService = inject(AuthenticationService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  user = input.required<User>();
  postContent = input.required<string>();
  date = input.required<string>();
  post = input.required<Post>();
  canComment = false;
  comments: Comment[] = [];
  commentContent = '';

  ngOnInit(): void {
    this.postService.postUpdate(this.user(), this.post()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  likePost(): void {
    this.postService.likePost(this.post()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  openComments(): void {
    this.canComment = true;
    this.postService
      .fetchPost()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.comments = data[this.post().id - 1].comments;
      });
  }

  shareComment(): void {
    this.postService.createComment(this.authenticationService.authenticatedUser, this.commentContent, this.post()).subscribe();
  }

  goToProfile(): void {
    this.router.navigate(['/feed', this.user().id]);
  }
}
