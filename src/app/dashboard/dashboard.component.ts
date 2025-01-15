import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/service/authentication.service';
import { MatButton } from '@angular/material/button';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [MatButton, MatSlideToggle, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  authenticator = inject(AuthenticationService);

  route = inject(Router);
  userName = this.authenticator.userName;
  userAge = this.authenticator.age;
  userScore = this.authenticator.score;
  olderScore = this.authenticator.olderScore;

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

  toggleDarkMode($event: MatSlideToggleChange) {
    if ($event.checked) {
      console.log($event.checked);
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
