import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  URL = 'http://localhost:3001';
  http = inject(HttpClient);

  get basicQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.URL}/questions`);
  }

  get hardQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.URL}/questions-plus`);
  }
}
