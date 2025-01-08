import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { UserDataService } from '../shared/service/user-data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../shared/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthenticationService } from '../shared/service/authentication.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf],
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

  ngOnInit() {
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
  }
  Register(): void {
    this.route.navigate(['/register']);
  }
}
