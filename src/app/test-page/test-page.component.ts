import {Component, inject, input, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {JsonPipe, Location, NgForOf} from '@angular/common';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {QuestionService} from '../shared/service/question.service';
import {Question} from '../shared/models';

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
  QuestionService = inject(QuestionService)
  age = input.required<number>()
  Questions: Question[]=[]
  CurrentQuestion =0
  Score=0


  ngOnInit() {
    this.QuestionService.getQuestions().subscribe(res=>{this.Questions=res})
  }

  TestForm = new FormGroup({
    Question: new FormControl('',[Validators.required])
  });

  goBack() {
    this.location.back()
  }

  SubmitQuestion() {
    console.log(this.TestForm.controls.Question.value)
    if(this.TestForm.controls.Question.value==="true"){
      this.Score+=2
    }
    this.CurrentQuestion++
    this.TestForm.controls['Question'].reset()

  }
}
