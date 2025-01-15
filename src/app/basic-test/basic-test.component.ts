import { Component, inject } from '@angular/core';
import { QuestionService } from '../shared/service/question.service';
import { Observable, of } from 'rxjs';
import { Question, Stats } from '../shared/models';
import { AuthenticationService } from '../shared/service/authentication.service';
import { TestPageComponent } from '../test-page/test-page.component';
import { CanDeactivate } from '../shared/models';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-basic-test',
  imports: [TestPageComponent, AsyncPipe],
  templateUrl: './basic-test.component.html',
  styleUrl: './basic-test.component.scss',
})
export class BasicTestComponent implements CanDeactivate {
  questionsService = inject(QuestionService);
  authenticationService = inject(AuthenticationService);
  questions$: Observable<Question[]> = this.questionsService.basicQuestions;
  isFinished = false;

  CanDeactivate(): Observable<boolean> {
    return of(this.isFinished);
  }

  onFinished(stats: Stats): void {
    this.isFinished = stats.saveOlder;
    this.authenticationService.setBasicUserScore(stats.score, this.authenticationService.authenticatedUser);
  }
}
