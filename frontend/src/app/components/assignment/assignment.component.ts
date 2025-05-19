import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { LearningPathComponent } from '../learning-path/learning-path.component';
import { ActivatedRoute } from '@angular/router';
import { Assignment } from '../../interfaces/assignment';
import { AssignmentService } from '../../services/assignment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateSubmissionComponent } from '../create-submission/create-submission.component';
import { LearningObject } from '../../interfaces/learning-object';
import { DirectedGraph, Node } from "../../datastructures/directed-graph";
import { ProgressService } from '../../services/progress.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Progress } from '../../interfaces/progress/progress';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { LoadingComponent } from '../loading/loading.component';
import { UserType } from '../../interfaces';
import { LearningPathService } from '../../services/learningPath.service';
import { SpecificLearningPathRequest } from '../../interfaces/learning-path';
import { CreateTaskComponent } from '../create-task/create-task-component/create-task.component';
import { AssignmentTask, MultipleChoice, NormalQuestion } from '../../interfaces/assignment/tasks';
import { TaskService } from '../../services/task.service';
import { MultipleChoiceTask, NormalQuestionTask, Task, TaskType } from '../../interfaces/tasks';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AssignmentStatsComponent } from '../assignment-stats/assignment-stats.component';
import { SubmissionService } from '../../services/submission.service';
import { UserService } from '../../services/user.service';
import { forkJoin, of, switchMap } from 'rxjs';
import { Submission } from '../../interfaces/submissions';
import { ChatPopupComponent } from '../chat-popup/chat-popup.component';

@Component({
  selector: 'app-assignment',
  imports: [
    LearningPathComponent,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    CreateSubmissionComponent,
    MatProgressBar,
    MatCardModule,
    LoadingComponent,
    CreateTaskComponent,
    AssignmentStatsComponent,
    ChatPopupComponent,
  ],
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.less'
})
export class AssignmentComponent implements OnInit {
  @ViewChild(LearningPathComponent) learningPathComponent!: LearningPathComponent;
  @ViewChild(AssignmentStatsComponent) statsComponent!: AssignmentStatsComponent;

  @Input() assignmentId!: string;
  @Input() initializeTasks: boolean = false;

  // The current activated route
  private readonly route = inject(ActivatedRoute);

  private readonly snackBar = inject(MatSnackBar);
  private readonly invalidURLMessage = $localize`Invalid URL`;
  private readonly closeMessage = $localize`Close`;
  public loading = true;
  public taskFetched = false;

  private _assignment?: Assignment;
  public graph: DirectedGraph<LearningObject> | undefined
  public progress!: Progress;
  public learningPathId: string = "";
  public language = "nl";
  public currentLearningObjectId!: string;
  public selectedNode: Node<LearningObject> | undefined;
  public step: number = 0;
  public furthestStep: number = 0; // This is the furthest reachable object
  public maxStep: number = 1;

  public isStudent!: boolean;

  public noTask!: boolean;
  public task!: Task | null;
  public taskType!: TaskType;
  public taskId!: string | null;
  public taskObject!: AssignmentTask;
  public alreadySubmitted!: boolean;
  public submissionType: string = "not-accepted";

  // A list for each User: every list is the list of submissions with index corresponding to assignment step
  public fullSubmissionData: Submission[][] = [];
  public submissionsForStep: Submission[] = [];
  public submissionStatsReady: boolean = false;

  public constructor(
    private assignmentService: AssignmentService,
    private progressService: ProgressService,
    private authService: AuthenticationService,
    private learningPathService: LearningPathService,
    private submissionService: SubmissionService,
    private userService: UserService,
    private taskService: TaskService,
  ) { }


  public get assignment(): Assignment | undefined {
    return this._assignment;
  }


  getProgressPercentage(): number {
    return ((this.step + 1) / this.maxStep) * 100;
  }

  onSelectedNodeChanged(node: Node<LearningObject>) {
    this.submissionStatsReady = false;
    this.currentLearningObjectId = node.value.metadata.hruid!;
    this.step = node.value.metadata.step!;
    this.alreadySubmitted = this.step < this.furthestStep;
    this.fetchTaskAndSubmissions();
  }

  retrieveGraph(graph: DirectedGraph<LearningObject>) {
    this.graph = graph;
    this.selectedNode = graph.nodes[this.step];
  }

  onSubmissionCreated(): void {
    this.openSnackBar($localize`Submission created!`)
    this.furthestStep = this.step + 1;
    if (this.learningPathComponent) {
      this.learningPathComponent.goToNextNode();
    }  // Execute goToNextNode in LearningPathComponent, this will call our onSelectedNodeChanged
  }

  reloadStats() {
    this.fetchTaskAndSubmissions();
  }

  onTaskCreated(taskData: AssignmentTask): void {
    // You should only be in able to have one task for each assignment (for now)
    if (this.taskId === null) return;

    // Determine what kind of task this is, and set the detailed part ready
    let casted, details;
    if (taskData.type === TaskType.NORMALQUESTION) {
      casted = taskData as NormalQuestion;
      details = { predefined_answer: casted.predefined_answer } as NormalQuestionTask;
    } else {
      casted = taskData as MultipleChoice;
      details = {
        options: casted.options,
        correctAnswers: casted.correctAnswers,
        allowMultipleAnswers: casted.allowMultipleAnswers,
      } as MultipleChoiceTask
    }
    // Define task
    const task: Task = {
      assignmentId: this.assignmentId,
      // We use index, backend uses position
      step: this.step + 1,
      question: taskData.question,
      type: taskData.type,
      details: details
    }
    this.taskService.createTask(task).subscribe(
      (id) => {
        this.taskId = id;
        this.openSnackBar($localize`Task Succesfully Created!`);
        this.fetchTaskAndSubmissions();
      }
    )
  }

  // Get the users progress for this assignment
  private getProgress(): void {
    const userId: string = this.authService.retrieveUserId()!;
    const progressObservable = this.progressService.getUserAssignmentProgress(
      userId, this.assignmentId
    )
    progressObservable.subscribe(
      (res) => {
        this.progress = res;
        this.step = 0;
        this.furthestStep = this.progress.step; // furthest step is always returned by progress
        this.alreadySubmitted = this.step < this.furthestStep
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


  private fetchTaskAndSubmissions() {
    this.taskFetched = false;
    this.submissionStatsReady = false;

    this.taskService.getSpecificTaskOfAssignment(this.assignmentId, this.step + 1).pipe(
      switchMap(task => {
        if (!task) {
          this.noTask = true;
          this.task = null;
          return of([]);
        }

        this.noTask = false;
        this.task = task;
        this.taskType = task.type;
        this.taskId = task.id!;
        this.taskObject = this.taskService.responseToObject(task);
        this.taskFetched = true;

        if (this.isStudent) {
          return of([]);
        } // Students will not see submissions of others

        return this.userService.assignmentUserIds(this.assignmentId).pipe(
          switchMap(userIds => forkJoin(
            userIds.map(userId => {
              return this.submissionService.userSubmissionForStep(userId, this.assignmentId, this.taskId!)
            }
            )
          ))
        );
      })
    ).subscribe(submissions => {
      this.submissionsForStep = submissions.filter(s => s !== null);
      if (this.isStudent) {
        this.submissionService.userSubmissionForStep(this.authService.retrieveUserId()!, this.assignmentId, this.taskId!).subscribe(
          submission => {
            if (submission) {
              this.alreadySubmitted = true;
              this.submissionType = submission.status;
            }
          }
        )
      }
      this.submissionStatsReady = true;
    });
  }

  public ngOnInit(): void {
    this.isStudent = this.authService.retrieveUserType() === UserType.STUDENT

    // Use the locale to determine in which language the learning path should be.
    const locale: string = window.location.pathname.split("/")[1];
    this.language = locale.split("-")[0]

    if (this.assignmentId) {
      const assignmentObservable = this.assignmentService.retrieveAssignmentById(this.assignmentId);
      assignmentObservable.subscribe(
        async (res) => {
          this._assignment = res;
          this.learningPathId = res.learningPathId;
          if (this._assignment && this.isStudent) {
            this.getProgress();
          } else if (!this.isStudent) {
            this.setupTeacher();
          }
          this.fetchTaskAndSubmissions();
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
