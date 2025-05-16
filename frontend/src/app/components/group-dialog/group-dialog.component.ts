import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MiniUserComponent } from '../mini-user/mini-user.component';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-group-dialog',
  imports: [MatCardModule, MiniUserComponent, MatListModule, MatButtonModule, MatIcon],
  templateUrl: './group-dialog.component.html',
  styleUrl: './group-dialog.component.less'
})
export class GroupDialogComponent {
  readonly dialogRef = inject(MatDialogRef<GroupDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  exit() {
    this.dialogRef.close()
  }
}
