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
import { Observable } from 'rxjs';

@Component({
  selector: 'app-test-page',
  imports: [MatIcon, ReactiveFormsModule, MatRadioGroup, MatRadioButton, JsonPipe, NgForOf],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.scss',
})
export class TestPageComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  questionService = inject(QuestionService);
  authenticationService = inject(AuthenticationService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  isOlder = input<boolean>();
  olderQuestions = input.required<Observable<Question[]>>();
  @Output() saveOlder = new EventEmitter<boolean>();

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
      if (!this.score) {
        this.score = 0;
      }
      this.olderQuestions()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(res => (this.questions = res));
    } else {
      this.score = 0;
      if (!this.olderScore) {
        this.olderScore = 0;
      }
      this.questionService
        .getQuestions(false)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(res => {
          this.questions = res;
        });
    }
  }

  TestForm = new FormGroup({
    Question: new FormControl('', [Validators.required]),
  });

  goBack(): void {
    this.router.navigate(['/dashboard', this.loggedUser.userName]);
  }

  canDeactivate(): true | Observable<boolean> {
    if (!this.saveChanges) {
      const DialogRef = this.dialog.open(ConfirmDialogComponent);
      return DialogRef.afterClosed();
    }
    return true;
  }

  SubmitQuestion(): void {
    const correctAnswer = this.questions[this.currentQuestion].options
      .filter(option => {
        return option.isCorrect;
      })
      .map(option => option.answer);
    this.getQuestion() != '' ? this.currentQuestion++ : this.getSnackBar('You must Select One Option');

    if (this.getQuestion() === 'true') {
      this.isOlder() ? (this.olderScore += 2) : (this.score += 2);
      this.getSnackBar('Your Awnser Was Correct');
    } else if (this.getQuestion() === 'false') {
      this.getSnackBar('Wrong, Correct awnser was:' + correctAnswer);
    }

    this.authenticationService.setUserScore(this.score.toString(), this.olderScore.toString(), this.loggedUser);
    this.TestForm.controls['Question'].reset();
    this.TestForm.controls['Question'].setValue('');

    if (this.questions[this.currentQuestion] === undefined) {
      this.saveOlder.emit(true);
      this.isFinished = true;
      this.saveChanges = true;
    }
  }

  getQuestion() {
    return this.TestForm.controls.Question.value;
  }

  getSnackBar(text: string) {
    this.snackBar.open(text, 'Close', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
