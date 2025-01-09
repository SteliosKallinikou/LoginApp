import { Component, inject } from '@angular/core';
import { QuestionService } from '../shared/service/question.service';
import { TestPageComponent } from '../test-page/test-page.component';
import { Question } from '../shared/models';
import { Observable, of } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate } from '../shared/models/CanDeactivate';

@Component({
  selector: 'app-test-page-older',
  imports: [TestPageComponent],
  templateUrl: './test-page-older.component.html',
  styleUrl: './test-page-older.component.scss',
})
export class TestPageOlderComponent implements CanDeactivate {
  questionsService = inject(QuestionService);
  questions$: Observable<Question[]> = this.questionsService.getQuestions(true);
  dialog = inject(MatDialog);
  isFinished = false;

  CanDeactivate(): Observable<boolean> {
    if (!this.isFinished) {
      const DialogRef = this.dialog.open(ConfirmDialogComponent);
      return DialogRef.afterClosed();
    } else {
      return of(true);
    }
  }
  onFinished(finished: boolean): void {
    this.isFinished = finished;
  }
}
