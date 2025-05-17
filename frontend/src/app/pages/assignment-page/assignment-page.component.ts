import { Component, inject, OnInit } from '@angular/core';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';
import { AssignmentComponent } from '../../components/assignment/assignment.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assignment-page',
  imports: [AuthenticatedHeaderComponent, AssignmentComponent],
  templateUrl: './assignment-page.component.html',
  styleUrl: './assignment-page.component.less'
})
export class AssignmentPageComponent implements OnInit {
  assignmentId!: string;

  // The current activated route
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.assignmentId = this.route.snapshot.paramMap.get('id')!;
  }

}
