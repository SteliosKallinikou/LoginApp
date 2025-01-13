import { Component, DestroyRef, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { UserDataService } from '../shared/service/user-data.service';
import { Router } from '@angular/router';
import { User } from '../shared/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ageValidator } from '../shared/validators/age-validator';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

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
  snackBar = inject(MatSnackBar);
  private readonly formBuilder = inject(UntypedFormBuilder);
  isRegistered = false;
  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.formBuilder.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      age: [null, [ageValidator(), Validators.required]],
      email: [null, [Validators.email, Validators.required]],
    });
  }

  register(): void {
    //TODO
    // const user = this.registerForm.getRawValue();
    // const userName = this.registerForm.controls['userName'].value;
    // const password = this.registerForm.controls['password'].value;
    // const age = this.registerForm.controls['age'].value;
    // const email = this.registerForm.controls['email'].value;
    // const user: User = { userName: userName, password: password, email: email, age: age, id: '', score: '', olderScore: '' };


    //TODO register should be disabled if registerForm is invalid so line below does not make sense
    // we can add additionally check if form is valid if this.registerForm.invalid return;
    !user.userName ? (this.isRegistered = false) : this.userService.registerUser(user);
    this.userService.validated$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => (this.isRegistered = data));

    //TODO this functionality should be moved we should look on it together and refactor
    if (this.isRegistered) {
      this.getSnackbar('You Have Succesfully Registered!');
      this.route.navigate(['/login']);
    } else {
      this.getSnackbar('Your Details Already Exist or You didnt provided any details');
    }
  }

  getSnackbar(text: string): void {
    this.snackBar.open(text, 'Close', {
      //TODO duration should be moved to some constant
      // Also we could create snackbar service and use it in all components
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
