import { Component, inject } from '@angular/core';
import { 
  MAT_DIALOG_DATA,
  MatDialogRef, 
  MatDialogActions,
  MatDialogContent
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';


/**
 * Data used in the ClassCodePopupComponent HTML
 */
export interface ClassCodePopupData {
  classCode: string;
}

@Component({
  selector: 'app-class-code-popup',
  imports: [
    // Angular material
    MatDialogActions,
    MatDialogContent,
    MatButtonModule
  ],
  templateUrl: './class-code-popup.component.html',
  styleUrl: './class-code-popup.component.less'
})
export class ClassCodePopupComponent {

  // Reference to the dialog
  readonly dialogRef = inject(MatDialogRef<ClassCodePopupComponent>);

  // Data that is used in the ClassCodePopupComponent HTML
  readonly data = inject<ClassCodePopupData>(MAT_DIALOG_DATA)

  /**
   * Close this popup
   */
  close(): void {
    this.dialogRef.close();
  }

}
