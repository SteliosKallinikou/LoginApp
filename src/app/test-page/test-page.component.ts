import { Component, DestroyRef, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe, NgForOf } from '@angular/common';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { QuestionService } from '../shared/service/question.service';
import { Question } from '../shared/models';
import { AuthenticationService } from '../shared/service/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { CanDeactivate } from '../shared/models/CanDeactivate';

@Component({
  selector: 'app-test-page',
  imports: [MatIcon, ReactiveFormsModule, MatRadioGroup, MatRadioButton, JsonPipe, NgForOf],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.scss',
})
export class TestPageComponent implements OnInit, CanDeactivate {
  destroyRef = inject(DestroyRef);
  questionService = inject(QuestionService);
  authenticationService = inject(AuthenticationService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  @Output() saveOlder = new EventEmitter<boolean>();
  isOlder = input<boolean>();
  olderQuestions = input.required<Observable<Question[]>>();

  questions: Question[] = [];
  currentQuestion = 0;
  loggedUser = this.authenticationService.getAuthenticatedUser();
  saveChanges = false;
  isFinished = false;
  score = this.authenticationService.getScore();
  olderScore = this.authenticationService.getOlderScore();

  ngOnInit(): void {
    if (this.isOlder()) {
      this.olderScore = 0;
      this.olderQuestions()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(res => (this.questions = res));
    } else {
      this.score = 0;
      this.questionService
        .getQuestions()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(res => {
          this.questions = res;
        });
    }
  }

  testForm = new FormGroup({
    question: new FormControl('', [Validators.required]),
  });

  goBack(): void {
    this.router.navigate(['/dashboard', this.loggedUser.userName]);
  }

  CanDeactivate(): Observable<boolean> {
    if (!this.saveChanges) {
      const DialogRef = this.dialog.open(ConfirmDialogComponent);
      return DialogRef.afterClosed();
    }
    return of(true);
  }

  submitQuestion(): void {
    const correctAnswer = this.questions[this.currentQuestion].options
      .filter(option => {
        return option.isCorrect;
      })
      .map(option => option.answer);
    this.getQuestion() != '' ? this.currentQuestion++ : this.getSnackBar('You must Select One Option');

    if (this.getQuestion() === 'true') {
      this.isOlder() ? (this.olderScore += 2) : (this.score += 2);
      this.getSnackBar('Your Answer Was Correct');
    } else if (this.getQuestion() === 'false') {
      this.getSnackBar('Wrong, Correct awnser was:' + correctAnswer);
    }

    this.authenticationService.setUserScore(this.score.toString(), this.olderScore.toString(), this.loggedUser);
    this.testForm.controls['question'].reset();

    if (!this.questions[this.currentQuestion]) {
      this.saveOlder.emit(true);
      this.isFinished = true;
      this.saveChanges = true;
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
}
