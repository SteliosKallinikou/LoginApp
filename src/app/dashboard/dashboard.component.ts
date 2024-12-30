import {Component, inject, input} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../shared/service/authentication.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  Authenticator = inject(AuthenticationService)
  name = input.required<string>()
  route= inject(Router)
  AuthenticatedUser = this.Authenticator.getAuthenticatedUser()

  EditProfile():void {
    this.route.navigate(['/profile',this.name()])
  }

  GoToTest():void {
    const age = parseInt(this.AuthenticatedUser.Age)
    this.route.navigate(['/test', age])
  }
}

