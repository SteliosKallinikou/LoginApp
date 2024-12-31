import {Component, inject, OnInit} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-alert-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss'
})
export class AlertDialogComponent implements OnInit{
  router = inject(Router)
  dialogRef:MatDialogRef<AlertDialogComponent> = inject(MatDialogRef)
  ngOnInit() {
   this.router.navigate(['/general-test'])
  }

  onClose() {
    this.dialogRef.close()
  }
}
