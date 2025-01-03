import {Component, DestroyRef, inject} from '@angular/core';
import {User} from '../shared/models';
import {AuthenticationService} from '../shared/service/authentication.service';
import {MatIcon} from '@angular/material/icon';
import {Location, NgIf} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserDataService} from '../shared/service/user-data.service';
import {canDeactivate} from '../shared/guard/canDeactivate';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Observable} from 'rxjs';



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
export class ProfileComponent implements canDeactivate{
  AuthenticationService= inject(AuthenticationService)
  destroyRef = inject(DestroyRef)
  location = inject(Location)
  DataService = inject(UserDataService)
  dialog = inject(MatDialog)
  SnackBar= inject(MatSnackBar)
  AuthenticatedUser: User = this.AuthenticationService.getAuthenticatedUser()
  NewUser:User ={UserName: "", Password: "", id:"", Email:"", Age: "",Score:"",OlderScore:""}
  SaveChanges=false



  EditForm = new FormGroup({
    UserName: new FormControl(this.AuthenticatedUser.UserName),
    Password: new FormControl(this.AuthenticatedUser.Password,[Validators.minLength(6)]),
    Age : new FormControl(this.AuthenticatedUser.Age),
    Email: new FormControl(this.AuthenticatedUser.Email,[Validators.email])
  });

  goBack():void{
    this.location.back()
  }

  canDeactivate():true| Observable<boolean>{
    if(!this.SaveChanges){
      const DialogRef = this.dialog.open(ConfirmDialogComponent);
      return DialogRef.afterClosed();
    }
    return true
  }

  Edit():void {
    this.NewUser.UserName=this.EditForm.value.UserName ?? ''
    this.NewUser.Password=this.EditForm.value.Password ?? ''
    this.NewUser.Age=this.EditForm.value.Age ?? ''
    this.NewUser.Email=this.EditForm.value.Email ?? ''
    this.NewUser.id=this.AuthenticatedUser.id
    this.DataService.changeUserDetails(this.NewUser,this.AuthenticatedUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res=>{
      console.log(res)
      if(res){
        this.SaveChanges=true
        this.SnackBar.open('Your Data was Saved Succesfully', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        })
      }
    })
  }

}
