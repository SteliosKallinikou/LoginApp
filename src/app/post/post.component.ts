import { Component, inject, input } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { PostService } from '../shared/service/post.service';
import {Comment, Post} from '../shared/models';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-post',
  imports: [MatCard, MatCardHeader, MatCardContent, MatCardActions, MatButton, MatCardTitle, MatCardSubtitle, ReactiveFormsModule, FormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  postService = inject(PostService);
  user = input.required<string>();
  postContent = input.required<string>();
  date = input.required<string>();
  post = input.required<Post>();
  canComment=false
  comments:Comment[]=[]
  commentContent=''


  likePost() {
    this.postService.likePost(this.post());
  }
  openComments() {
    this.canComment=true
    this.postService.post.subscribe(data=>{
      this.comments=data[this.post().id-1].comments
    })
  }

  shareComment() {
    this.postService.createComment(this.user(),this.commentContent,this.post())
  }
}
