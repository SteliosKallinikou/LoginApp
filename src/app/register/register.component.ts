import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { UserDataService } from '../shared/service/user-data.service';
import { Router } from '@angular/router';
import { User } from '../shared/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { age_Validator } from '../shared/validators/age_validator';

@Component({
  selector: 'app-register',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  userService = inject(UserDataService);
  route = inject(Router);
  destroyRef = inject(DestroyRef);
  snackBar = inject(MatSnackBar);
  private readonly formBuilder = inject(UntypedFormBuilder);
  isRegistered = false;
  registerForm: FormGroup = new FormGroup({});

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.minLength(6)]],
      age: [null, [age_Validator()]],
      email: [null, [Validators.email]],
    });
  }

  register(): void {
    const userName = this.registerForm.controls['userName'].value;
    const password = this.registerForm.controls['password'].value;
    const age = this.registerForm.controls['age'].value;
    const email = this.registerForm.controls['email'].value;
    const user: User = { userName: userName, password: password, email: email, age: age, id: '', score: '', olderScore: '' };

    !user.userName ? (this.isRegistered = false) : this.userService.RegisterUser(user);
    this.userService.Validated$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => (this.isRegistered = data));

    if (this.isRegistered) {
      this.getSnackbar('You Have Succesfully Registered!');
      this.route.navigate(['/login']);
    } else {
      this.getSnackbar('Your Details Already Exist or You didnt provided any details');
    }
  }

  getSnackbar(text: string): void {
    this.snackBar.open(text, 'Close', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
