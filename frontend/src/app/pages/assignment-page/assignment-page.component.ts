import { Component } from '@angular/core';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';
import { AssignmentComponent } from '../../components/assignment/assignment.component';

@Component({
  selector: 'app-assignment-page',
  imports: [AuthenticatedHeaderComponent, AssignmentComponent],
  templateUrl: './assignment-page.component.html',
  styleUrl: './assignment-page.component.less'
})
export class AssignmentPageComponent {

}
