import { Component, inject } from '@angular/core';
import { QuestionService } from '../shared/service/question.service';
import { TestPageComponent } from '../test-page/test-page.component';
import { Question } from '../shared/models';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate } from '../shared/models/CanDeactivate';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-test-page-older',
  imports: [TestPageComponent, AsyncPipe],
  templateUrl: './test-page-older.component.html',
  styleUrl: './test-page-older.component.scss',
})
export class TestPageOlderComponent implements CanDeactivate {
  questionsService = inject(QuestionService);
  questions$: Observable<Question[]> = this.questionsService.getQuestions(true);
  dialog = inject(MatDialog);
  isFinished = false;

  CanDeactivate(): boolean {
    return this.isFinished;
  }
  onFinished(finished: boolean): void {
    this.isFinished = finished;
  }
}
