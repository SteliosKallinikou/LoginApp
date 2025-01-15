import { Component, DestroyRef, inject } from '@angular/core';
import { UserDataService } from '../shared/service/user-data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../shared/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthenticationService } from '../shared/service/authentication.service';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatButton, MatLabel, MatFormField, MatInput, MatError],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent{
  userService = inject(UserDataService);
  authenticationService = inject(AuthenticationService);
  destroyRef = inject(DestroyRef);
  route = inject(Router);
  formBuilder = inject(FormBuilder);
  isAuthenticated = true;
  loginForm: FormGroup

constructor() {
  this.loginForm = this.formBuilder.group({
    userName: [null, [Validators.required]],
    password: [null, [Validators.required, Validators.minLength(6)]],
  });
}

  login(): void {
    const user: User = this.loginForm.getRawValue();

    this.userService.user.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      if (this.authenticationService.isAuthenticated(data, user)) {
        this.route.navigate(['/dashboard']);
      } else {
        this.isAuthenticated = false;
      }
    });
  }

  register(): void {
    this.route.navigate(['/register']);
  }
}
