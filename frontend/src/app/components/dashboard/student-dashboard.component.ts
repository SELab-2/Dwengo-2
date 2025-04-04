import { CommonModule } from '@angular/common';
import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AssignmentsService } from '../../services/assignments.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Assignment } from '../../interfaces/assignments/assignment';
import { ErrorService } from '../../services/error.service';

import { NewAssignment } from '../../interfaces/assignments/newAssignment';
import { NewClass } from '../../interfaces/classes/newClass';
import { ClassesService } from '../../services/classes.service';


@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.less'],
//   providers: [StudentDashboardService]
})
export class StudentDashboardComponent implements OnInit {

  // id: string = "test";
  // learningPathsLink: string = '/student/learning-paths';

  // selectedView: string | null = null;

  constructor(
      private authService: AuthenticationService,
      private errorService: ErrorService,
      private assignmentsService: AssignmentsService,
      private _assignments: Assignment[] = [],

      // private classesService: ClassesService,
      // private newClass: NewClass = {} as NewClass,
      // private newAssignment: NewAssignment = {} as NewAssignment,
      // private classId: string = '',
      // private assignmentId: string = '',
    ) {}
  
  ngOnInit() {
     //TODO remove this test code
    // this.newClass = {
    //   name: "math",
    //   description: "math class",
    //   targetAudience: "students",
    //   teacherId: this.authService.retrieveUserId()?.toString() || '',
    // };

    // this.classesService.createClass(this.newClass).subscribe(
    //     this.errorService.subscribeHandler("An error occured, please try again",
    //         (id) => {
    //             this.classId = id;
    //             console.log("Class created with ID: ", id);
    //         }
    //     )); //TODO remove this test code
    
    // this.newAssignment = {
    //   classId: this.classId,
    //   learningPathId: "test",
    //   startDate: "2023-10-01",
    //   deadline: "2023-10-31",
    //   extraInstructions: "test123",
    // }; //TODO remove this test code

    // this.assignmentsService.createAssignment(this.newAssignment).subscribe(
    //     this.errorService.subscribeHandler("An error occured, please try again",
    //         (id) => {
    //             this.assignmentId = id;
    //             console.log("Assignment created with ID: ", id);
    //         }
    //     )); //TODO remove this test code


    this.assignmentsService
      .assignmentsOfUser()
      .subscribe({
        next: (assignments) => this._assignments = assignments,
      });
    
    this._assignments = [ //TODO remove this test code
      {
        id: "1",
        classId: "1",
        learningPathId: "1",
        startDate: "2023-10-01",
        deadline: "2023-10-31",
        extraInstructions: "test123",
      },
      {
        id: "2",
        classId: "2",
        learningPathId: "2",
        startDate: "2023-11-01",
        deadline: "2023-11-15",
        extraInstructions: "test456",
      }
    ]
  }

  // setView(view: string) {
  //   this.selectedView = this.selectedView === view ? null : view;
  // }
}