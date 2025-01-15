import { Component, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-rating',
  imports: [MatIcon],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
})
export class RatingComponent implements OnInit {
  testScore = input.required<number>();
  stars: number[] = [];
  ngOnInit() {
    if (this.testScore()) this.stars = new Array(this.testScore() / 2);
  }
}
