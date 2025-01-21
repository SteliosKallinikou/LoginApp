import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/service/authentication.service';
import { MatButton } from '@angular/material/button';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [MatButton, MatSlideToggle, FormsModule, MatGridList, MatGridTile, NgOptimizedImage],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  authenticator = inject(AuthenticationService);

  route = inject(Router);
  userName = this.authenticator.userName;
  userAge = this.authenticator.age;
  userScore = this.authenticator.score;
  olderScore = this.authenticator.olderScore;
  profilePic = this.authenticator.profilePicture;
  isDarkMode = false;

  ngOnInit(): void {
    if (this.authenticator.isDark) {
      this.isDarkMode = true;
      this.authenticator.toggleDarkMode(this.isDarkMode);
    }
    console.log(this.isDarkMode);
  }

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

  goToLeaderBoards(): void {
    this.route.navigate(['/leaderboard']);
  }

  toggleDarkMode($event: MatSlideToggleChange): void {
    this.authenticator.toggleDarkMode($event.checked);
  }

  goToFeed(): void {
    this.route.navigate(['/feed']);
  }
}
