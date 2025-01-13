import { Component, DestroyRef, inject } from '@angular/core';
import { User } from '../shared/models';
import { AuthenticationService } from '../shared/service/authentication.service';
import { MatIcon } from '@angular/material/icon';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDataService } from '../shared/service/user-data.service';
import { CanDeactivate } from '../shared/models';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ageValidator } from '../shared/validators/age-validator';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [MatIcon, FormsModule, ReactiveFormsModule, MatError, MatFormField, MatInput, MatLabel, MatButton],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements CanDeactivate {
  authenticationService = inject(AuthenticationService);
  destroyRef = inject(DestroyRef);
  location = inject(Location);
  dataService = inject(UserDataService);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  formBuilder = inject(FormBuilder);
  authenticatedUser: User = this.authenticationService.getAuthenticatedUser();
  saveChanges = false;
  editForm: FormGroup;

  constructor() {
    this.editForm = this.formBuilder.group({
      userName: [this.authenticatedUser.userName],
      password: [this.authenticatedUser.password, [Validators.minLength(6)]],
      age: [this.authenticatedUser.age, [ageValidator()]],
      email: [this.authenticatedUser.email, [Validators.email]],
    });
  }

  goBack(): void {
    this.location.back();
  }
  CanDeactivate(): Observable<boolean> {
    return of(this.editForm.pristine);
  }

  updateUserProfile(): void {
    //TODO do ou need original user here? if yes it could be like
    //    const newUser: User = {
    //       ...this.authenticatedUser,
    //       ...this.editForm.getRawValue(),
    //     };
    const newUser = {
      ...this.editForm.getRawValue(),
    };
    this.dataService
      .changeUserDetails(newUser, this.authenticatedUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        if (res) {
          this.saveChanges = true;
          this.snackBar.open('Your Data was Saved Successfully', 'Close', {
            //TODO maybe better add duration to constant file in case you want to change it ore reuse it
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      });
  }
}
