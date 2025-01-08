import {Component, inject} from '@angular/core';
import {QuestionService} from '../shared/service/question.service';
import {TestPageComponent} from '../test-page/test-page.component';
import {Question} from '../shared/models';
import {Observable} from 'rxjs';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-test-page-older',
  imports: [
    TestPageComponent
  ],
  templateUrl: './test-page-older.component.html',
  styleUrl: './test-page-older.component.scss'
})
export class TestPageOlderComponent{
  questionsService = inject(QuestionService)
  Questions$: Observable<Question[]>=this.questionsService.getQuestions(true)
  dialog = inject(MatDialog)
  isFinished = false

  canDeactivate():true|Observable<boolean>{
    if(!this.isFinished){
      const DialogRef = this.dialog.open(ConfirmDialogComponent);
      return DialogRef.afterClosed();
    }else {
      return true
    }
  }
  onFinished(Finished: boolean):void {
    this.isFinished=Finished
  }

}

