import {inject, DestroyRef,Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {User} from '../models';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  Http = inject(HttpClient)
  URL = "http://localhost:3000/users"
  private dataSubject = new BehaviorSubject<boolean>(false)
  data$=this.dataSubject.asObservable()
  DestroyRef = inject(DestroyRef)

  getUser():Observable<User[]>{
    return this.Http.get<User[]>(this.URL)
  }

  changeUserDetails(CurrUser:User,PrevUser: User):Observable<Object>{
    localStorage.setItem('user',JSON.stringify(CurrUser))
    let ReplaceUrl= `${this.URL}/${PrevUser.id}`
    return this.Http.put(ReplaceUrl,CurrUser)
  }

  RegisterUser(RegisterUser:User){
    this.getUser().pipe(takeUntilDestroyed(this.DestroyRef)).subscribe(data=>{
      RegisterUser.id=String(data.length + 1)
      if(data.filter(data=>data.Email===RegisterUser.Email || data.UserName===RegisterUser.UserName).length!=0){
        this.dataSubject.next(false)
      }else{
        this.dataSubject.next(true)
        this.Http.post<User>(this.URL,RegisterUser).pipe(takeUntilDestroyed(this.DestroyRef)).subscribe()
      }
    })
  }
}
