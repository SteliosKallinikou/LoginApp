import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import { UserDataService } from '../shared/service/user-data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../shared/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthenticationService } from '../shared/service/authentication.service';
import { NgIf } from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {merge} from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf, MatButton, MatLabel, MatFormField, MatInput, MatError],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  userService = inject(UserDataService);
  authenticationService = inject(AuthenticationService);
  destroyRef = inject(DestroyRef);
  route = inject(Router);
  formBuilder = inject(FormBuilder);
  userName = '';
  userInput: User = {} as User;
  isAuthenticated = true;
  loginForm: FormGroup = new FormGroup({});
  errorMessage = signal('')



  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  login(): void {
    this.userName = this.loginForm.controls['userName'].value;
    this.userInput.userName = this.loginForm.controls['userName'].value;
    this.userInput.password = this.loginForm.controls['password'].value;

    this.userService
      .getUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        if (this.authenticationService.isAuthenticated(data, this.userInput)) {
          this.route.navigate(['/dashboard', this.userName]);
        } else {
          this.isAuthenticated = false;
        }
      });

    merge(this.loginForm.controls['userName'].statusChanges, this.loginForm.controls['userName'].valueChanges).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(()=>this.updateErrorMessage())

  }

  register(): void {
    this.route.navigate(['/register']);
  }

  updateErrorMessage() {
    if(this.loginForm.invalid){
      this.errorMessage.set('Username or Password is Invalid')
    }

  }
}
