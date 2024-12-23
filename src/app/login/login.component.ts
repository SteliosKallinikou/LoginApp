import {Component, DestroyRef, inject} from '@angular/core';
import {UserDataService} from '../shared/service/user-data.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {User} from '../shared/models';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AuthenticationService} from '../shared/service/authentication.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  UserService = inject(UserDataService)
  auth=inject(AuthenticationService)
  DestroyRef = inject(DestroyRef)
  route= inject(Router)
  UserName=''
  Password=''
  User: User | undefined
  input: User={UserName: "", Password: ""}


  LoginForm= new FormGroup({
    UserName: new FormControl(''),
    Password: new FormControl('')
  })

  login() {
    this.UserName=this.LoginForm.value.UserName ?? ''
    this.Password= this.LoginForm.value.Password ?? ''
    this.input.UserName= this.UserName
    this.input.Password=this.Password

    this.UserService.getUser().pipe(takeUntilDestroyed(this.DestroyRef)).subscribe(data=>{
      if(this.auth.isAuthenticated(data,this.input)){
        this.User=data
        this.route.navigate(['/dashboard',this.UserName])
      }
    })
  }
}
