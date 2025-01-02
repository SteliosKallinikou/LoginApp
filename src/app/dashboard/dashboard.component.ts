import {Component, inject, input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../shared/service/authentication.service';
import {MatButton} from '@angular/material/button';


@Component({
  selector: 'app-dashboard',
  imports: [
    MatButton
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  Authenticator = inject(AuthenticationService)
  UserName = input.required<string>()
  route= inject(Router)
  AuthenticatedUser = this.Authenticator.getAuthenticatedUser()
  UserAge = parseInt(this.AuthenticatedUser.Age)
  UserScore = this.AuthenticatedUser.Score

  ngOnInit() {
    const match= this.route.url.match(/[^/]+$/)
    if(!(match) || match[0]!=null){
      if(!(match) || match[0]!=this.AuthenticatedUser.UserName){
        this.route.navigate(['*'])
      }
    }
  }

  EditProfile():void {
    this.route.navigate(['/profile',this.UserName()])
  }

  GoToGeneralTest():void {
      this.route.navigate(['/general-test'])

  }

  GoToOlderTest():void {
    this.route.navigate(['/general-test',this.UserAge])
  }
}

