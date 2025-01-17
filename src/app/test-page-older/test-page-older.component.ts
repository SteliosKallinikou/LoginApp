import { Component, inject } from '@angular/core';
import { QuestionService } from '../shared/service/question.service';
import { TestPageComponent } from '../test-page/test-page.component';
import { Question, Stats } from '../shared/models';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate } from '../shared/models';
import { AuthenticationService } from '../shared/service/authentication.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-test-page-older',
  imports: [TestPageComponent, AsyncPipe],
  templateUrl: './test-page-older.component.html',
  styleUrl: './test-page-older.component.scss',
})
export class TestPageOlderComponent implements CanDeactivate {
  questionsService = inject(QuestionService);
  authenticationService = inject(AuthenticationService);
  questions$: Observable<Question[]> = this.questionsService.hardQuestions;
  dialog = inject(MatDialog);
  isFinished = false;

  CanDeactivate(): Observable<boolean> {
    if (this.authenticationService.age < 18) {
      return of(true);
    } else {
      return of(this.isFinished);
    }
  }

  onFinished(stats: Stats): void {
    this.isFinished = stats.saveOlder;
    const userScore = stats.score;
    this.authenticationService.setOlderUserScore(userScore, this.authenticationService.authenticatedUser);
  }
}
