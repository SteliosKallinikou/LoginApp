import { Component, input } from '@angular/core';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  user = input.required<string>();
  postContent = input.required<string>();
  date = input.required<string>();
}
