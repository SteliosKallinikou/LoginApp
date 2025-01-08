import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/service/authentication.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  imports: [MatButton],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  authenticator = inject(AuthenticationService);
  userName = input.required<string>();
  route = inject(Router);
  userAge = this.authenticator.getAge();
  userScore = this.authenticator.getScore();
  olderScore = this.authenticator.getOlderScore();

  editProfile(): void {
    this.route.navigate(['/profile']);
  }

  goToGeneralTest(): void {
    this.route.navigate(['/general-test']);
  }
  goToOlderTest(): void {
    this.route.navigate(['/general-test', this.userAge]);
  }

  logOut(): void {
    if (this.authenticator.isLogOutAvailable()) {
      this.route.navigate(['']);
    }
  }
}
