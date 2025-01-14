import { Component, inject } from '@angular/core';
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

  route = inject(Router);
  userName=this.authenticator.userName
  userAge = this.authenticator.Age;
  userScore = this.authenticator.Score;
  olderScore = this.authenticator.OlderScore;

  editProfile(): void {
    this.route.navigate(['/profile']);
  }

  goToGeneralTest(): void {
    this.route.navigate(['/test']);
  }

  goToOlderTest(): void {
    this.route.navigate(['/test', this.userAge]);
  }

  logOut(): void {
    this.authenticator.logOut();
  }

  goToLeaderBoards() {
    this.route.navigate(['/leaderboard']);
  }
}
