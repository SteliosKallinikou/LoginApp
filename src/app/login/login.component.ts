import {Component, DestroyRef, inject} from '@angular/core';
import {UserDataService} from '../shared/service/user-data.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {User} from '../shared/models';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AuthenticationService} from '../shared/service/authentication.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  UserService = inject(UserDataService)
  AuthenticationService=inject(AuthenticationService)
  DestroyRef = inject(DestroyRef)
  route= inject(Router)
  UserName=''
  Password=''
  UserInput: User={UserName: "", Password: "", id:"", Email:"", Age:"",Score:""}
  isAuthenticated=true


  LoginForm= new FormGroup({
    UserName: new FormControl('',[Validators.required]),
    Password: new FormControl('',[Validators.required, Validators.minLength(6)])
  },{updateOn: "change"})


  login():void {
    this.UserName=this.LoginForm.value.UserName ?? ''
    this.Password= this.LoginForm.value.Password ?? ''
    this.UserInput.UserName= this.UserName
    this.UserInput.Password=this.Password

    this.UserService.getUser().pipe(takeUntilDestroyed(this.DestroyRef)).subscribe(data=>{
      console.log(data,this.UserInput)
      if(this.AuthenticationService.isAuthenticated(data,this.UserInput)){
        this.route.navigate(['/dashboard',this.UserName])
      }else{
        this.isAuthenticated=false
      }
    })
  }
}
