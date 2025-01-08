import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators
} from "@angular/forms";
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
export class RegisterComponent implements OnInit{

  UserService = inject(UserDataService)
  route=inject(Router)
  DestroyRef = inject(DestroyRef)
  SnackBar= inject(MatSnackBar)
  private readonly formBuilder = inject(UntypedFormBuilder);
  isRegistered=false
  RegisterForm:FormGroup = new FormGroup({})

  ngOnInit() {
    this.RegisterForm = this.formBuilder.group({
      userName: [null,[Validators.required]],
      password:[null,[Validators.minLength(6)]],
      age : [null,[age_Validator()]],
      email: [null,[Validators.email]]
    })
  }

  Register():void {
    const userName=this.RegisterForm.controls['userName'].value
    const password=this.RegisterForm.controls['password'].value
    const age=this.RegisterForm.controls['age'].value
    const email=this.RegisterForm.controls['email'].value
    const user:User={UserName: userName, Password: password, Email: email, Age: age, id: '', Score:'',OlderScore:''}

    !user.UserName ?
      this.isRegistered=false:
      this.UserService.RegisterUser(user)
      this.UserService.Validated$.pipe(takeUntilDestroyed(this.DestroyRef)).subscribe(data=>this.isRegistered=data)

    if(this.isRegistered){
      this.getSnackbar('You Have Succesfully Registered!')
      this.route.navigate(['/login'])
    }else{
      this.getSnackbar('Your Details Already Exist or You didnt provided any details')
    }
  }

  getSnackbar(text:string):void{
    this.SnackBar.open(text, 'Close', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    })
  }
}
