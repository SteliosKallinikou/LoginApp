import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Question} from '../models';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  URL="http://localhost:3001/questions"
  http= inject(HttpClient)

  getQuestions(){
    return this.http.get<Question[]>(this.URL)
  }


}
