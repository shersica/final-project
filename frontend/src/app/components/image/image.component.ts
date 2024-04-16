import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrl: './image.component.css'
})
export class ImageComponent {

  image: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.image = data.image;
  }

}
