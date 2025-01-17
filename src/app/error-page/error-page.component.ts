import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Location } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-error-page',
  imports: [MatIcon, MatButton],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent {
  location = inject(Location);
  goBack() {
    this.location.back();
  }
}
