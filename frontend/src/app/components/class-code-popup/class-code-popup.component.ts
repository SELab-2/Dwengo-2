import { Component, inject, Input } from '@angular/core';
import { 
  MAT_DIALOG_DATA,
  MatDialogRef, 
  MatDialog, 
  MatDialogActions,
  MatDialogClose,
  MatDialogContent
} from '@angular/material/dialog';

export interface ClassCodePopupData {
  classCode: string;
}

@Component({
  selector: 'app-class-code-popup',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent
  ],
  templateUrl: './class-code-popup.component.html',
  styleUrl: './class-code-popup.component.less'
})
export class ClassCodePopupComponent {

  readonly dialogRef = inject(MatDialogRef<ClassCodePopupComponent>);
  readonly data = inject<ClassCodePopupData>(MAT_DIALOG_DATA)

  onNoClick(): void {
    this.dialogRef.close();
  }

}
