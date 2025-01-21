import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/service/authentication.service';
import { MatButton } from '@angular/material/button';
import { PostComponent } from '../post/post.component';
import { FormsModule } from '@angular/forms';
import { PostService } from '../shared/service/post.service';
import { Post } from '../shared/models';

import { interval, switchMap } from 'rxjs';
import { Location } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-feed-page',
  imports: [MatButton, PostComponent, FormsModule, MatProgressSpinner],
  templateUrl: './feed-page.component.html',
  styleUrl: './feed-page.component.scss',
})
export class FeedPageComponent implements OnInit {
  authenticationService = inject(AuthenticationService);
  postService = inject(PostService);
  location = inject(Location);
  destroyRef = inject(DestroyRef);
  authenticatedUser = this.authenticationService.authenticatedUser;
  text = '';
  posts: Post[] = [];
  isLoaded = false;

  ngOnInit(): void {
    interval(1000)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.postService.post)
      )
      .subscribe(data => {
        this.posts = data;
        this.isLoaded = true;
      });
  }

  postContent(input: string): void {
    this.postService.createPost(this.authenticatedUser, input);
  }

  goBack(): void {
    this.location.back();
  }
}
