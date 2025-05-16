import { Component, inject } from '@angular/core';
import { CreateRequestComponent } from '../create-request/create-request.component';
import { MatIcon } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-request-class-modal',
  imports: [CreateRequestComponent, MatIcon],
  templateUrl: './request-class-modal.component.html',
  styleUrl: './request-class-modal.component.less'
})
export class RequestClassModalComponent {
  private dialogRef = inject(MatDialogRef<RequestClassModalComponent>);
  closeModal() {
    this.dialogRef.close();
  }
}
