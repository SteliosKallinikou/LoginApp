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

@Component({
  selector: 'app-test-page',
  imports: [MatIcon, ReactiveFormsModule, MatRadioGroup, MatRadioButton, JsonPipe, NgForOf, MatButton],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.scss',
})
export class TestPageComponent implements CanDeactivate, OnInit {
  authenticationService = inject(AuthenticationService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  destroyRef = inject(DestroyRef);
  @Output() userStats = new EventEmitter<{ saveOlder: boolean; score: string }>();
  //TODO input.required<Question[]>();
  olderQuestions = input.required<Observable<Question[]>>();

  //TODO in case of input.required<Observable<Question[]>>(); questions variable is useless
  questions: Question[] = [];
  currentQuestion = 0;
  loggedUser = this.authenticationService.getAuthenticatedUser();
  isFinished = false;
  score = 0;
  testForm: FormGroup;

  constructor() {
    this.testForm = new FormGroup({
      question: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.olderQuestions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.questions = res;
      });
  }

//TODO it should not be here
//   testForm = new FormGroup({
//     question: new FormControl('', [Validators.required]),
//   });

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
      //TODO this should be a constant
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
