import {Component, computed, input} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-rating',
  imports: [MatIcon],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
})
export class RatingComponent {
  testScore = input.required<number>();

  stars = computed(() => {
    const score = this.testScore();
    return score ? new Array(Math.floor(score / 2)) : [];
  });

}
