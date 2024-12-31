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
  age = parseInt(this.AuthenticatedUser.Age)

  EditProfile():void {
    this.route.navigate(['/profile',this.name()])
  }

  GoToGeneralTest():void {
      this.route.navigate(['/general-test'])

  }

  GoToOlderTest() {
    this.route.navigate(['/general-test',this.age])
  }
}

