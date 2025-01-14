import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDataService } from '../shared/service/user-data.service';
import { Router } from '@angular/router';
import { User } from '../shared/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ageValidator } from '../shared/validators/age-validator';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { SnackbarService } from '../shared/service/snacbar.service';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatError, MatFormField, MatInput, MatLabel, MatButton],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  userService = inject(UserDataService);
  route = inject(Router);
  destroyRef = inject(DestroyRef);
  snackBarService = inject(SnackbarService);
  formBuilder = inject(FormBuilder);
  isRegistered = true;
  registerForm: FormGroup = new FormGroup({});
  user: User = {} as User;

  constructor() {
    this.registerForm = this.formBuilder.group({
      userName: ['test7', [Validators.required]],
      password: ['test123', [Validators.required, Validators.minLength(6)]],
      age: [20, [ageValidator(), Validators.required]],
      email: ['test8@this.com', [Validators.email, Validators.required]],
    });
    this.user = { ...this.registerForm.getRawValue() };
  }

  register(): void {
    !this.user.userName
      ? (this.isRegistered = false)
      : this.userService
          .registerUser(this.user)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(data => {
            if (data) {
              this.snackBarService.getSnackBar('You Have Succesfully Registered!');
              this.route.navigate(['/login']);
            } else {
              this.snackBarService.getSnackBar('Your Details Already Exist or You didnt provided any details');
            }
          });
  }
}
