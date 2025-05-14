import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';
import { LearningPathComponent } from '../../components/learning-path/learning-path.component';
import { ActivatedRoute } from '@angular/router';
import { Assignment } from '../../interfaces/assignment';
import { AssignmentService } from '../../services/assignment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateSubmissionComponent } from '../../components/create-submission/create-submission.component';
import { LearningObject } from '../../interfaces/learning-object';
import { Node } from "../../datastructures/directed-graph";
import { ProgressService } from '../../services/progress.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Progress } from '../../interfaces/progress/Progress';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { LoadingComponent } from '../../components/loading/loading.component';
import { UserType } from '../../interfaces';
import { LearningPathService } from '../../services/learningPath.service';
import { SpecificLearningPathRequest } from '../../interfaces/learning-path';
import { CreateTaskComponent, TaskType } from '../../components/create-task/create-task-component/create-task.component';
import { AssignmentTask, MultipleChoice } from '../../interfaces/assignment/tasks';

@Component({
  selector: 'app-assignment-page',
  imports: [AuthenticatedHeaderComponent, LearningPathComponent, CreateSubmissionComponent, MatProgressBar, MatCardModule, LoadingComponent, CreateTaskComponent],
  templateUrl: './assignment-page.component.html',
  styleUrl: './assignment-page.component.less'
})
export class AssignmentPageComponent implements OnInit {
  @ViewChild(LearningPathComponent) learningPathComponent!: LearningPathComponent;

  // The current activated route
  private readonly route = inject(ActivatedRoute);

  private readonly snackBar = inject(MatSnackBar);
  private readonly invalidURLMessage = $localize`Invalid URL`;
  private readonly closeMessage = $localize`Close`;
  public loading = true;
  public taskFetched = false;

  public taskObject!: AssignmentTask;
  public taskType!: TaskType;

  private _assignment?: Assignment;
  public progress!: Progress;
  public assignmentId!: string;
  public learningPathId: string = "";
  public language = "nl";
  public currentLearningObjectId!: string;
  public step: number = 0;
  public furthestStep: number = 0; // This is the furthest progress point achieved
  public maxStep: number = 1;

  public isStudent!: boolean;


  public constructor(
    private assignmentService: AssignmentService,
    private progressService: ProgressService,
    private authService: AuthenticationService,
    private learningPathService: LearningPathService,
  ) { }


  public get assignment(): Assignment | undefined {
    return this._assignment;
  }


  getProgressPercentage(): number {
    return (this.step / this.maxStep) * 100;
  }

  onSelectedNodeChanged(node: Node<LearningObject> | null) {
    if (node) {
      this.currentLearningObjectId = node.value.metadata.hruid!;
    }
  }

  onSubmissionCreated(): void {
    this.learningPathComponent.goToNextNode();  // Execute goToNextNode in LearningPathComponent
    this.step = Math.min(this.step + 1, this.maxStep) // Update step
  }

  onTaskCreated(task: AssignmentTask): void {
    // Implement and call the services to create this task
    // Link this with the current step
    this.openSnackBar($localize`Task Succesfully Created!`);
    console.log(task);
  }

  // Get the users progress for this assignment
  private getProgress(): void {
    const userId: string = this.authService.retrieveUserId()!;
    const progressObservable = this.progressService.getUserAssignmentProgress(
      userId, this.assignmentId
    )
    progressObservable.subscribe(
      (res) => {
        console.log(res)
        this.progress = res;
        this.step = this.progress.step;
        this.furthestStep = this.progress.step; // furthest step is always returned by progress
        this.maxStep = this.progress.maxStep;
        this.loading = false;
      }
    )
  }

  private setupTeacher(): void {
    // Let the teacher always start at the beginning
    this.step = 0;
    this.loading = false;
    // Set the length of the learning path, we cant use our viewchild because at this point is has not been created
    this.learningPathService.retrieveOneLearningPath({ hruid: this.learningPathId, language: this.language } as SpecificLearningPathRequest).subscribe(
      (path) => {
        this.maxStep = path.numNodes
      }
    )
  }

  // TODO: implement
  private setupSubmission(): void {
    // only show submission when its created
    this.taskType = TaskType.MultipleChoice;
    this.taskObject = {
      question: "Test Question",
      allowMultipleAnswers: true,
      options: ["Test answer 1", "Some longer test answer to check if this is actually a good format and all that, because maybe it is not.", "Test answer 3"],
      selected: [],
      coorectAnswers: [0, 2]
    } as MultipleChoice
    // this.taskObject = {
    //   question: "What is 1 + 1",
    //   predefined_answer: "2",
    // } as NormalQuestion; // Cast the AssignmentTask to what we need

    this.taskFetched = true;
  }

  public ngOnInit(): void {
    this.isStudent = this.authService.retrieveUserType() === UserType.STUDENT

    // Use the locale to determine in which language the learning path should be.
    const locale: string = window.location.pathname.split("/")[1];
    this.language = locale.split("-")[0]

    const assignmentId = this.route.snapshot.paramMap.get('id');

    if (assignmentId) {
      this.assignmentId = assignmentId;
      const assignmentObservable = this.assignmentService.retrieveAssignmentById(this.assignmentId);
      assignmentObservable.subscribe(
        (res) => {
          console.log(res)
          this._assignment = res;
          this.learningPathId = res.learningPathId;
          if (this._assignment && this.isStudent) {
            this.getProgress();
          } else if (!this.isStudent) {
            this.setupTeacher();
          }
          this.setupSubmission();
        }
      )
    } else {
      this.openSnackBar(this.invalidURLMessage, this.closeMessage);
    }
  }

  private openSnackBar(message: string, action: string = "Ok") {
    this.snackBar.open(message, action, {
      duration: 2500
    });
  }

}
