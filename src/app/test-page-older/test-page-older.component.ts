import { Component, inject } from '@angular/core';
import { QuestionService } from '../shared/service/question.service';
import { TestPageComponent } from '../test-page/test-page.component';
import { Question } from '../shared/models';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate } from '../shared/models';
import { AuthenticationService } from '../shared/service/authentication.service';

@Component({
  selector: 'app-test-page-older',
  imports: [TestPageComponent],
  templateUrl: './test-page-older.component.html',
  styleUrl: './test-page-older.component.scss',
})
export class TestPageOlderComponent implements CanDeactivate {
  questionsService = inject(QuestionService);
  authenticationService = inject(AuthenticationService);
  questions$: Observable<Question[]> = this.questionsService.getHardQuestions();
  dialog = inject(MatDialog);
  isFinished = false;
  //TODO userScore useless variable
  userScore = '';

  CanDeactivate(): Observable<boolean> {
    return of(this.isFinished);
  }

  onFinished(stats: { saveOlder: boolean; score: string }): void {
    this.isFinished = stats.saveOlder;
    this.userScore = stats.score;
    this.authenticationService.setOlderUserScore(this.userScore, this.authenticationService.getAuthenticatedUser());
  }
}
