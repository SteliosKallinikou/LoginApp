import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-image-dialog',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatInput,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    NgOptimizedImage,
    FormsModule,
  ],
  templateUrl: './image-dialog.component.html',
  styleUrl: './image-dialog.component.scss',
})
export class ImageDialogComponent {
  imageDialog: MatDialogRef<MatDialog> = inject(MatDialogRef);

  onClose(result: string): void {
    this.imageDialog.close(result);
  }
  imageURL = '';
}
