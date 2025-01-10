import { Component, inject } from '@angular/core';
import { QuestionService } from '../shared/service/question.service';
import { Observable, of } from 'rxjs';
import { Question } from '../shared/models';
import { AuthenticationService } from '../shared/service/authentication.service';
import { TestPageComponent } from '../test-page/test-page.component';
import { CanDeactivate } from '../shared/models';

@Component({
  selector: 'app-basic-test',
  imports: [TestPageComponent],
  templateUrl: './basic-test.component.html',
  styleUrl: './basic-test.component.scss',
})
export class BasicTestComponent implements CanDeactivate {
  questionsService = inject(QuestionService);
  authenticationService = inject(AuthenticationService);
  questions$: Observable<Question[]> = this.questionsService.getBasicQuestions();
  isFinished = false;
  userScore = '';

  CanDeactivate(): Observable<boolean> {
    return of(this.isFinished);
  }

  onFinished(stats: { saveOlder: boolean; score: string }): void {
    this.isFinished = stats.saveOlder;
    this.userScore = stats.score;
    this.authenticationService.setBasicUserScore(this.userScore, this.authenticationService.getAuthenticatedUser());
  }
}
