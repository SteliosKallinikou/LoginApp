import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AuthenticationService } from '../shared/service/authentication.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { PostComponent } from '../post/post.component';
import { FormsModule } from '@angular/forms';
import { PostService } from '../shared/service/post.service';
import { Post } from '../shared/models';

import { interval, switchMap } from 'rxjs';
import { Location, NgOptimizedImage } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed-page',
  imports: [MatButton, PostComponent, FormsModule, MatProgressSpinner, MatIcon, NgOptimizedImage, MatIconButton],
  templateUrl: './feed-page.component.html',
  styleUrl: './feed-page.component.scss',
})
export class FeedPageComponent implements OnInit {
  authenticationService = inject(AuthenticationService);
  postService = inject(PostService);
  location = inject(Location);
  destroyRef = inject(DestroyRef);
  imageDialog = inject(MatDialog);
  router = inject(Router);
  authenticatedUser = this.authenticationService.authenticatedUser;
  text = '';
  posts: Post[] = [];
  isLoading = false;
  imageURL = signal('');

  ngOnInit(): void {
    interval(1000)
      .pipe(
        switchMap(() => {
          this.isLoading = false;
          return this.postService.fetchPost();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: data => {
          this.posts = data;
          this.isLoading = true;
        },
        error: _err => {
          this.isLoading = true;
        },
      });
  }

  postContent(input: string): void {
    this.postService
      .createPost(this.authenticatedUser, input, this.imageURL())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.imageURL.set('');
        },
        error: err => {
          console.error('Failed to create post:', err);
        },
      });
  }

  goBack(): void {
    this.location.back();
  }

  addImage(): void {
    this.imageDialog
      .open(ImageDialogComponent)
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.imageURL.set(data));
  }

  goToMessages() {
    this.router.navigate(['/messages']);
  }
}
