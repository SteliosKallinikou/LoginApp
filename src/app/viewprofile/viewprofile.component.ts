import { Component, inject, input } from '@angular/core';
import { Location, NgOptimizedImage } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { PostComponent } from '../post/post.component';
import { Post, User } from '../shared/models';
import { PostService } from '../shared/service/post.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-viewprofile',
  imports: [NgOptimizedImage, MatButton, PostComponent, MatIcon],
  templateUrl: './viewprofile.component.html',
  styleUrl: './viewprofile.component.scss',
})
export class ViewprofileComponent {
  postService = inject(PostService);
  location = inject(Location);
  posts: Post[] = [];
  id = input<string>();
  user: User = {} as User;

  constructor() {
    console.log(this.id());
    this.postService.post.subscribe(result => {
      result.find(post => {
        if (post.belongsTo.id === this.id()) {
          this.posts.push(post);
          this.user = post.belongsTo;
        }
      });
    });
  }

  goBack():void {
    this.location.back();
  }

  follow():void {
    this.postService.followUser(this.user);
  }
}
