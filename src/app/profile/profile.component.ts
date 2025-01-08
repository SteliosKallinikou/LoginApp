import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {User} from '../shared/models';
import {AuthenticationService} from '../shared/service/authentication.service';
import {MatIcon} from '@angular/material/icon';
import {Location, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserDataService} from '../shared/service/user-data.service';
import {canDeactivate} from '../shared/guard/canDeactivate';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Observable} from 'rxjs';
import {age_Validator} from '../shared/validators/age_validator';



@Component({
  selector: 'app-profile',
  imports: [
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements canDeactivate,OnInit{
  authenticationService= inject(AuthenticationService)
  destroyRef = inject(DestroyRef)
  location = inject(Location)
  dataService = inject(UserDataService)
  dialog = inject(MatDialog)
  snackBar= inject(MatSnackBar)
  formBuilder = inject(FormBuilder)
  authenticatedUser: User = this.authenticationService.getAuthenticatedUser()
  newUser:User ={} as User
  saveChanges=false
  EditForm:FormGroup = new FormGroup({})

  ngOnInit() {

    this.EditForm= this.formBuilder.group({
      userName: [this.authenticatedUser.UserName],
      password:[this.authenticatedUser.Password,[Validators.minLength(6)]],
      age : [this.authenticatedUser.Age,[age_Validator()]],
      email: [this.authenticatedUser.Email,[Validators.email]]
    })
  }

  goBack():void{
    this.location.back()
  }

  canDeactivate():true| Observable<boolean>{
    if(!this.saveChanges){
      const DialogRef = this.dialog.open(ConfirmDialogComponent);
      return DialogRef.afterClosed();
    }
    return true
  }

  Edit():void {
    this.newUser.UserName=this.EditForm.controls['userName'].value
    this.newUser.Password=this.EditForm.controls['password'].value
    this.newUser.Age=this.EditForm.controls['age'].value
    this.newUser.Email=this.EditForm.controls['email'].value
    this.newUser.id=this.authenticatedUser.id
    this.newUser.Score=this.authenticatedUser.Score
    this.newUser.OlderScore=this.authenticatedUser.OlderScore
    this.dataService.changeUserDetails(this.newUser,this.authenticatedUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res=>{
      if(res){
        this.saveChanges=true
        this.snackBar.open('Your Data was Saved Succesfully', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        })
      }
    })
  }

}
