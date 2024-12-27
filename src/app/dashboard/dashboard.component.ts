import {Component, inject, input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  name = input.required<string>()
  route= inject(Router)

  EditProfile(){
    this.route.navigate(['/profile',this.name()])
  }
}

