import {Component,DestroyRef, inject} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserDataService} from '../shared/service/user-data.service';
import {Router} from '@angular/router';
import {User} from '../shared/models';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatSnackBar} from '@angular/material/snack-bar';
import {age_Validator} from '../shared/validators/age_validator';

@Component({
  selector: 'app-register',
    imports: [
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  UserService = inject(UserDataService)
  route=inject(Router)
  DestroyRef = inject(DestroyRef)
  SnackBar= inject(MatSnackBar)
  isRegistered=false


  RegisterForm= new FormGroup({
    UserName: new FormControl('',[Validators.required]),
    Password: new FormControl('',[Validators.required, Validators.minLength(6)]),
    Email: new FormControl('',[Validators.required, Validators.email]),
    Age: new FormControl('',[Validators.required,age_Validator()])
  })

  Register():void {
    const UserName=this.RegisterForm.value.UserName ?? ''
    const Password= this.RegisterForm.value.Password ?? ''
    const Email = this.RegisterForm.value.Email ?? ''
    const Age = this.RegisterForm.value.Age??''
    const User:User={UserName: UserName, Password: Password, Email: Email, Age: Age, id: '', Score:'',OlderScore:''}
    this.UserService.RegisterUser(User)
    this.UserService.Validated$.pipe(takeUntilDestroyed(this.DestroyRef)).subscribe(data=>this.isRegistered=data)

    if(this.isRegistered){
      this.SnackBar.open('You have Succesfully Registered', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      })
      this.route.navigate(['/login'])
    }else{
      this.SnackBar.open('The email or username you provided already exists try changing it', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      })
    }
  }
}
