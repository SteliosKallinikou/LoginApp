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
  authenticatedUser = this.authenticationService.authenticatedUser;
  text = '';
  posts: Post[] = [];
  isLoading = false;
  imageURL = signal('');

  ngOnInit(): void {
    interval(1000)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => {
          this.isLoading = false;
          return this.postService.fetchPost();
        })
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
    this.postService.createPost(this.authenticatedUser, input, this.imageURL()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    this.imageURL.set('');
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
}
