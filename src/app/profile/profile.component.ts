import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { User } from '../shared/models';
import { AuthenticationService } from '../shared/service/authentication.service';
import { MatIcon } from '@angular/material/icon';
import { Location, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDataService } from '../shared/service/user-data.service';
import { canDeactivate } from '../shared/guard/canDeactivate';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { age_Validator } from '../shared/validators/age_validator';

@Component({
  selector: 'app-profile',
  imports: [MatIcon, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements canDeactivate, OnInit {
  authenticationService = inject(AuthenticationService);
  destroyRef = inject(DestroyRef);
  location = inject(Location);
  dataService = inject(UserDataService);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  formBuilder = inject(FormBuilder);
  authenticatedUser: User = this.authenticationService.getAuthenticatedUser();
  newUser: User = {} as User;
  saveChanges = false;
  editForm: FormGroup = new FormGroup({});

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      userName: [this.authenticatedUser.userName],
      password: [this.authenticatedUser.password, [Validators.minLength(6)]],
      age: [this.authenticatedUser.age, [age_Validator()]],
      email: [this.authenticatedUser.email, [Validators.email]],
    });
  }

  goBack(): void {
    this.location.back();
  }

  canDeactivate(): true | Observable<boolean> {
    if (!this.saveChanges) {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent);
      return confirmDialog.afterClosed();
    }
    return true;
  }

  Edit(): void {
    this.newUser.userName = this.editForm.controls['userName'].value;
    this.newUser.password = this.editForm.controls['password'].value;
    this.newUser.age = this.editForm.controls['age'].value;
    this.newUser.email = this.editForm.controls['email'].value;
    this.newUser.id = this.authenticatedUser.id;
    this.newUser.score = this.authenticatedUser.score;
    this.newUser.olderScore = this.authenticatedUser.olderScore;
    this.dataService
      .changeUserDetails(this.newUser, this.authenticatedUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        if (res) {
          this.saveChanges = true;
          this.snackBar.open('Your Data was Saved Succesfully', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      });
  }
}
