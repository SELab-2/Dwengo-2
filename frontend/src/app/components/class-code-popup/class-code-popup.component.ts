import { Component, inject, Input } from '@angular/core';
import { 
  MAT_DIALOG_DATA,
  MatDialogRef, 
  MatDialog, 
  MatDialogActions,
  MatDialogClose,
  MatDialogContent
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';


export interface ClassCodePopupData {
  classCode: string;
}

@Component({
  selector: 'app-class-code-popup',
  imports: [
    // Angular material
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatButtonModule
  ],
  templateUrl: './class-code-popup.component.html',
  styleUrl: './class-code-popup.component.less'
})
export class ClassCodePopupComponent {

  readonly dialogRef = inject(MatDialogRef<ClassCodePopupComponent>);
  readonly data = inject<ClassCodePopupData>(MAT_DIALOG_DATA)

  close(): void {
    this.dialogRef.close();
  }

}
