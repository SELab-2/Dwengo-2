import { Component, inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';
import { LearningPathComponent } from '../../components/learning-path/learning-path.component';
import { ActivatedRoute } from '@angular/router';
import { Assignment } from '../../interfaces/assignment';
import { AssignmentService } from '../../services/assignment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LearningPathService } from '../../services/learningPath.service';
import { CreateSubmissionComponent } from '../../components/create-submission/create-submission.component';
import { LearningObject } from '../../interfaces/learning-object';
import { Node } from "../../datastructures/directed-graph";
import { ProgressService } from '../../services/progress.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Progress } from '../../interfaces/progress/Progress';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-assignment-page',
  imports: [AuthenticatedHeaderComponent, LearningPathComponent, CreateSubmissionComponent, MatProgressBar, MatCardModule],
  templateUrl: './assignment-page.component.html',
  styleUrl: './assignment-page.component.less'
})
export class AssignmentPageComponent implements OnInit {
  @ViewChild(LearningPathComponent) learningPathComponent!: LearningPathComponent;
  // The current activated route
  private readonly route = inject(ActivatedRoute);

  private readonly snackBar = inject(MatSnackBar);
  private readonly invalidURLMessage = $localize `Invalid URL`;
  private readonly closeMessage = $localize `Close`;
  public loading = true;

  private _assignment?: Assignment;
  public progress!: Progress;
  public assignmentId!: string;
  public learningPathId: string = "";
  public language = "nl";
  public currentLearningObjectId!: string;
  public step: number = 0;
  public maxStep: number = 1;
   

  public constructor(
    private assignmentService: AssignmentService,
    private progressService: ProgressService,
    private authService: AuthenticationService,
  ) {}

  getProgressPercentage(): number {
    return (this.step/this.maxStep)*100;
  }
  
  onSelectedNodeChanged(node: Node<LearningObject> | null) {
    this.currentLearningObjectId = node?.value.metadata.hruid!;
  }

  ngAfterViewInit(): void {}

  onSubmissionCreated(): void {
    this.learningPathComponent.goToNextNode();  // Roep de goToNextNode aan in de LearningPathComponent
    this.step = Math.min(this.step + 1, this.maxStep) // Update step
  }

  private getProgress(): void {
    const userId: string = this.authService.retrieveUserId()!;
    const progressObservable = this.progressService.getUserAssignmentProgress(
      userId, this.assignmentId
    )
    progressObservable.subscribe(
      (res) => {
        this.progress = res;
        this.step = this.progress.step;
        this.maxStep = this.progress.maxStep;
        console.log(this.progress);
        this.loading = false;
      }
    )
  }

  public ngOnInit(): void {
    const assignmentId = this.route.snapshot.paramMap.get('id');

    if (assignmentId) {
      this.assignmentId = assignmentId;
      const assignmentObservable = this.assignmentService.retrieveAssignmentById(this.assignmentId);
-      assignmentObservable.subscribe(
        (res) => {
          this._assignment = res;
          if (this._assignment) {
            this.getProgress();
            this.learningPathId = this._assignment.learningPathId;
          }
        }
      )
    } else {
      this.openSnackBar(this.invalidURLMessage, this.closeMessage);
    }
  }
  
  private openSnackBar(message: string, action: string="Ok") {
    this.snackBar.open(message, action, {
        duration: 2500
    });
  }

}
