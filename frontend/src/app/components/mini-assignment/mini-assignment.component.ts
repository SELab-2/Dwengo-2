import { Component, Input } from '@angular/core';
import { Assignment } from '../../interfaces/assignments/assignment';
import { CommonModule } from '@angular/common'
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card'
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-mini-assignment',
  imports: [
    CommonModule,
    RouterLink,

    // Material design
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent
  ],
  templateUrl: './mini-assignment.component.html',
  styleUrl: './mini-assignment.component.less'
})
export class MiniAssignmentComponent {

  // We get our assignment from somewhere else
  @Input() _assignment!: Assignment;

}
