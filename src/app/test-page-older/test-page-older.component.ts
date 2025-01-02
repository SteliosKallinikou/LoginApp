import {Component, inject, input} from '@angular/core';
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
  QuestionsService = inject(QuestionService)
  Questions$: Observable<Question[]>=this.QuestionsService.getHardQuestions()
  dialog = inject(MatDialog)
  Age = input.required<number>()
  isFinished = false



  canDeactivate():true|Observable<boolean>{
    if(this.Age()>18 && !this.isFinished){
      const DialogRef = this.dialog.open(ConfirmDialogComponent);
      return DialogRef.afterClosed();
    }else {
      return true
    }
  }
  onFinished(Finished: boolean) {
    this.isFinished=Finished
  }

}

