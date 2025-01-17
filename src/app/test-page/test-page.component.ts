import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { JsonPipe, NgForOf } from '@angular/common';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { Question, Stats } from '../shared/models';
import { AuthenticationService } from '../shared/service/authentication.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CanDeactivate } from '../shared/models';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { SnackbarService } from '../shared/service/snacbar.service';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-test-page',
  imports: [MatIcon, ReactiveFormsModule, MatRadioGroup, MatRadioButton, JsonPipe, NgForOf, MatButton, MatProgressBar, RatingComponent],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.scss',
})
export class TestPageComponent implements CanDeactivate {
  authenticationService = inject(AuthenticationService);
  router = inject(Router);
  snackBarService = inject(SnackbarService);
  destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(UntypedFormBuilder);
  userStats = output<Stats>();
  olderQuestions = input.required<Question[]>();

  currentQuestion = 0;
  isFinished = false;
  score = 0;
  testForm: FormGroup;

  constructor() {
    this.testForm = this.formBuilder.group({
      question: [null, [Validators.required]],
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  CanDeactivate(): Observable<boolean> {
    return of(this.testForm.pristine);
  }

  submitQuestion(): void {
    const correctAnswer = this.olderQuestions()
      [this.currentQuestion].options.filter(option => {
        return option.isCorrect;
      })
      .map(option => option.answer);
    this.currentQuestion++;

    if (this.question === 'true') {
      this.snackBarService.openSnackBar('Your Answer Was Correct');
      this.score += 2;
    } else {
      this.snackBarService.openSnackBar('Wrong, Correct answer was:' + correctAnswer);
    }

    this.testForm.controls['question'].reset();
    if (!this.olderQuestions()[this.currentQuestion]) {
      this.isFinished = true;
      this.userStats.emit({ saveOlder: true, score: this.score.toString() });
    }
  }

  get question(): string | null {
    return this.testForm.controls['question'].value;
  }

  goToLeaderBoards() {
    this.router.navigate(['/leaderboard']);
  }
}
