import {Component, DestroyRef, EventEmitter, inject, input, OnInit, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {JsonPipe, NgForOf} from '@angular/common';
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
  destroyRef= inject(DestroyRef)
  QuestionService = inject(QuestionService)
  AuthenticationService = inject(AuthenticationService)
  router= inject(Router)
  SnackBar= inject(MatSnackBar)
  dialog = inject(MatDialog)
  isOlder = input<boolean>()
  OlderQuestions= input.required<Observable<Question[]>>()
  @Output() SaveOlder = new EventEmitter<boolean>()
  @Output() ScoreOlder = new EventEmitter<number>()


  Questions: Question[]=[]
  CurrentQuestion =0
  LoggedUser = this.AuthenticationService.getAuthenticatedUser()
  SaveChanges =false
  isFinished=false
  Score=parseInt(this.LoggedUser.Score)
  OlderScore=parseInt(this.LoggedUser.OlderScore)



  ngOnInit():void {
    if(this.isOlder()){
      this.OlderScore=0
      if(!parseInt(this.LoggedUser.Score)){
        this.Score=0
      }
      this.OlderQuestions().subscribe(res=>this.Questions=res)
    }else{
      this.Score=0
      if(!parseInt(this.LoggedUser.OlderScore)){
        this.OlderScore=0
      }
      this.QuestionService.getQuestions().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res=>{
        this.Questions=res
      })
    }
  }

  TestForm = new FormGroup({
    Question: new FormControl('',[Validators.required])
  });

  goBack():void {
    this.router.navigate(['/dashboard',this.LoggedUser.UserName])
  }

  canDeactivate():true|Observable<boolean>{
    if(!this.SaveChanges){
      const DialogRef = this.dialog.open(ConfirmDialogComponent);
      return DialogRef.afterClosed();
    }
    return true
  }

  SubmitQuestion():void {
    if(this.TestForm.controls.Question.value!=""){
      this.CurrentQuestion++
    }else{
      this.SnackBar.open('You must Select One Option', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      })
    }

    if(this.TestForm.controls.Question.value==="true"){
      if(this.isOlder()){
        this.OlderScore+=2
        console.log(this.AuthenticationService.getAuthenticatedUser())
      }else{
        this.Score+=2
      }
      this.SnackBar.open('Your Awnser Was Correct', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',

      })
    }else if(this.TestForm.controls.Question.value==="false"){
      this.SnackBar.open('Your Awnser Was Incorrect', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',

      })

    }

    this.AuthenticationService.setUserScore(this.Score.toString(),this.OlderScore.toString(),this.LoggedUser)
    this.TestForm.controls['Question'].reset()
    this.TestForm.controls['Question'].setValue("")

    if(this.Questions[this.CurrentQuestion]===undefined){
      this.SaveOlder.emit(true)
      this.isFinished=true
      this.SaveChanges=true
    }
  }
}
