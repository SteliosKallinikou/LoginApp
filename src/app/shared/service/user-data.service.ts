import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {User} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  Http = inject(HttpClient)
  URL = "http://localhost:3000/users"

  getUser():Observable<User[]>{
    return this.Http.get<User[]>(this.URL)
  }

  changeUserDetails(CurrUser:User,PrevUser: User){
    localStorage.setItem('user',JSON.stringify(CurrUser))
    let ReplaceUrl= `${this.URL}/${PrevUser.id}`
    return this.Http.put(ReplaceUrl,CurrUser)
  }

}
