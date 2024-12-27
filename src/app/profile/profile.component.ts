import {Component, inject} from '@angular/core';
import {User} from '../shared/models';
import {AuthenticationService} from '../shared/service/authentication.service';
import {MatIcon} from '@angular/material/icon';
import {Location} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserDataService} from '../shared/service/user-data.service';



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
export class ProfileComponent {
  AuthenticationService= inject(AuthenticationService)
  location = inject(Location)
  AuthenticatedUser: User = this.AuthenticationService.getAuthenticatedUser()
  newUser:User ={UserName: "", Password: "", id:"", Email:"", Age: ""}
  DataService = inject(UserDataService)

  EditForm = new FormGroup({
    UserName: new FormControl(this.AuthenticatedUser.UserName),
    Password: new FormControl(this.AuthenticatedUser.Password),
    Age : new FormControl(this.AuthenticatedUser.Age),
    Email: new FormControl(this.AuthenticatedUser.Email)
  });

  goBack(){
    this.location.back()
  }

  Edit() {
    this.newUser.UserName=this.EditForm.value.UserName ?? ''
    this.newUser.Password=this.EditForm.value.Password ?? ''
    this.newUser.Age=this.EditForm.value.Age ?? ''
    this.newUser.Email=this.EditForm.value.Email ?? ''
    console.log(this.newUser)
    this.DataService.changeUserDetails(this.newUser,this.AuthenticatedUser).subscribe(res=>console.log(res))
  }
}
