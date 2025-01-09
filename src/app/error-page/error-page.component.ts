import {Component, inject} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {Location} from '@angular/common';

@Component({
  selector: 'app-error-page',
  imports: [
    MatIcon
  ],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent {
  location = inject(Location)
  goBack() {
    this.location.back()
  }
}
