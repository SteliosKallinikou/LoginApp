import { Component, inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/service/authentication.service';
import { MatButton } from '@angular/material/button';
import { PostComponent } from '../post/post.component';
import { FormsModule } from '@angular/forms';
import { PostService } from '../shared/service/post.service';
import { Post } from '../shared/models';

import { interval, switchMap } from 'rxjs';
import {Location} from '@angular/common';

@Component({
  selector: 'app-feed-page',
  imports: [MatButton, PostComponent, FormsModule],
  templateUrl: './feed-page.component.html',
  styleUrl: './feed-page.component.scss',
})
export class FeedPageComponent implements OnInit {
  authenticationService = inject(AuthenticationService);
  postService = inject(PostService);
  location=inject(Location)
  authenticatedUser = this.authenticationService.authenticatedUser;
  text = '';
  posts: Post[] = [];

  ngOnInit(): void {
    interval(2000)
      .pipe(switchMap(() => this.postService.post))
      .subscribe(data => (this.posts = data));
  }

  postContent(input: string): void {
    this.postService.createPost(this.authenticatedUser, input);
  }

  goBack() {
    this.location.back()
  }
}
