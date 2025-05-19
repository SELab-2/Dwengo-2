import { Component, inject, OnInit } from '@angular/core';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';
import { AssignmentComponent } from '../../components/assignment/assignment.component';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { UserType } from '../../interfaces';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-assignment-page',
  imports: [
    AuthenticatedHeaderComponent,
    AssignmentComponent,
    MatCardModule
  ],
  templateUrl: './assignment-page.component.html',
  styleUrl: './assignment-page.component.less'
})
export class AssignmentPageComponent implements OnInit {
  assignmentId!: string;
  isTeacher: boolean = false;

  // The current activated route
  private readonly route = inject(ActivatedRoute);

  constructor(
    private readonly authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.isTeacher = this.authService.retrieveUserType() === UserType.TEACHER;
    this.assignmentId = this.route.snapshot.paramMap.get('id')!;
  }

}
