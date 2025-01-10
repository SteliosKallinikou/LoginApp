import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../models';
import { Observable } from 'rxjs';
import { QuestionLevel } from '../enums/question-level';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  URL = 'http://localhost:3001';
  http = inject(HttpClient);

  //TODO
  getQuestions(hard = false): Observable<Question[]> {
    const questionLevel = hard ? QuestionLevel.HARD : QuestionLevel.EASY;
    return this.http.get<Question[]>(`${this.URL}/${questionLevel}`);
  }
}
