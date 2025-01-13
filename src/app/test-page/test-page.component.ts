import { Component, DestroyRef, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe, NgForOf } from '@angular/common';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { Question } from '../shared/models';
import { AuthenticationService } from '../shared/service/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { CanDeactivate } from '../shared/models';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-test-page',
  imports: [MatIcon, ReactiveFormsModule, MatRadioGroup, MatRadioButton, JsonPipe, NgForOf, MatButton, MatProgressBar],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.scss',
})
export class TestPageComponent implements CanDeactivate, OnInit {
  authenticationService = inject(AuthenticationService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  destroyRef = inject(DestroyRef);
  @Output() userStats = new EventEmitter<{ saveOlder: boolean; score: string }>();
  olderQuestions = input.required<Observable<Question[]>>();

  questions: Question[] = [];
  currentQuestion = 0;
  loggedUser = this.authenticationService.getAuthenticatedUser();
  isFinished = false;
  score = 0;

  ngOnInit() {
    this.olderQuestions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.questions = res;
      });
  }

  testForm = new FormGroup({
    question: new FormControl('', [Validators.required]),
  });

  goBack(): void {
    this.router.navigate(['/dashboard', this.loggedUser.userName]);
  }

  CanDeactivate(): Observable<boolean> {
    return of(this.isFinished);
  }

  submitQuestion(): void {
    const correctAnswer = this.questions[this.currentQuestion].options
      .filter(option => {
        return option.isCorrect;
      })
      .map(option => option.answer);
    this.currentQuestion++;

    if (this.getQuestion() === 'true') {
      this.getSnackBar('Your Answer Was Correct');
      this.score += 2;
    } else {
      this.getSnackBar('Wrong, Correct answer was:' + correctAnswer);
    }

    this.testForm.controls['question'].reset();

    if (!this.questions[this.currentQuestion]) {
      this.isFinished = true;
      this.userStats.emit({ saveOlder: true, score: this.score.toString() });
    }
  }

  getQuestion(): string | null {
    return this.testForm.controls.question.value;
  }

  getSnackBar(text: string): void {
    this.snackBar.open(text, 'Close', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  goToLeaderBoards() {
    this.router.navigate(['/leaderboard']);
  }
}
