import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {JsonPipe, Location, NgForOf} from '@angular/common';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {QuestionService} from '../shared/service/question.service';
import {Question} from '../shared/models';
import {AuthenticationService} from '../shared/service/authentication.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-test-page',
  imports: [
    MatIcon,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    JsonPipe,
    NgForOf
  ],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.scss'
})
export class TestPageComponent implements OnInit{
  location = inject(Location)
  destroyRef= inject(DestroyRef)
  QuestionService = inject(QuestionService)
  AuthenticationService = inject(AuthenticationService)
  router= inject(Router)
  SnackBar= inject(MatSnackBar)
  dialog = inject(MatDialog)

  Questions: Question[]=[]
  CurrentQuestion =0
  Score=0
  LoggedUser = this.AuthenticationService.getAuthenticatedUser()
  SaveChanges =false
  isFinished=false



  ngOnInit():void {
    this.QuestionService.getQuestions().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res=>{
      this.Questions=res

    })
  }

  TestForm = new FormGroup({
    Question: new FormControl('',[Validators.required])
  });

  goBack():void {
    this.location.back()
  }

  canDeactivate():true|Observable<boolean>{
    if(!this.SaveChanges){
      const DialogRef = this.dialog.open(ConfirmDialogComponent);
      return DialogRef.afterClosed();
    }
    return true
  }

  SubmitQuestion():void {
    if(this.TestForm.controls.Question.value==="true"){
      this.Score+=2
      this.SnackBar.open('Your Awnser Was Correct', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',

      })
    }
    this.CurrentQuestion++
    this.AuthenticationService.setUserScore(this.Score.toString(),this.LoggedUser)
    this.TestForm.controls['Question'].reset()
    if(this.Questions[this.CurrentQuestion]===undefined){
      this.isFinished=true
    }
  }

  GoHome():void {
    this.router.navigate(['/dashboard',this.LoggedUser.UserName])

  }
}
