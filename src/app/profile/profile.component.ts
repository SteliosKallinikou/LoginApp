import {Component, inject} from '@angular/core';
import {User} from '../shared/models';
import {AuthenticationService} from '../shared/service/authentication.service';
import {MatIcon} from '@angular/material/icon';
import {Location} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserDataService} from '../shared/service/user-data.service';
import {canDeactivate} from '../shared/guard/canDeactivate';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';



@Component({
  selector: 'app-profile',
  imports: [
    MatIcon,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements canDeactivate{
  AuthenticationService= inject(AuthenticationService)
  location = inject(Location)
  DataService = inject(UserDataService)
  dialog = inject(MatDialog)
  SnackBar= inject(MatSnackBar)

  newUser:User ={UserName: "", Password: "", id:"", Email:"", Age: ""}
  AuthenticatedUser: User = this.AuthenticationService.getAuthenticatedUser()
  SaveChanges=false


  EditForm = new FormGroup({
    UserName: new FormControl(this.AuthenticatedUser.UserName),
    Password: new FormControl(this.AuthenticatedUser.Password),
    Age : new FormControl(this.AuthenticatedUser.Age),
    Email: new FormControl(this.AuthenticatedUser.Email)
  });

  goBack(){
    this.location.back()
  }

  canDeactivate(){
    if(!this.SaveChanges){
      const DialogRef = this.dialog.open(ConfirmDialogComponent);
      return DialogRef.afterClosed();
    }
    return true
  }

  Edit() {
    this.newUser.UserName=this.EditForm.value.UserName ?? ''
    this.newUser.Password=this.EditForm.value.Password ?? ''
    this.newUser.Age=this.EditForm.value.Age ?? ''
    this.newUser.Email=this.EditForm.value.Email ?? ''
    this.DataService.changeUserDetails(this.newUser,this.AuthenticatedUser).subscribe(res=>{
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
