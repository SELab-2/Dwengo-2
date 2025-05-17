import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';
import { LearningPathComponent } from '../../components/learning-path/learning-path.component';
import { ActivatedRoute } from '@angular/router';
import { Assignment } from '../../interfaces/assignment';
import { AssignmentService } from '../../services/assignment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateSubmissionComponent } from '../../components/create-submission/create-submission.component';
import { LearningObject } from '../../interfaces/learning-object';
import { DirectedGraph, Node } from "../../datastructures/directed-graph";
import { ProgressService } from '../../services/progress.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Progress } from '../../interfaces/progress/progress';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { LoadingComponent } from '../../components/loading/loading.component';
import { UserType } from '../../interfaces';
import { LearningPathService } from '../../services/learningPath.service';
import { SpecificLearningPathRequest } from '../../interfaces/learning-path';
import { CreateTaskComponent } from '../../components/create-task/create-task-component/create-task.component';
import { AssignmentTask, MultipleChoice, NormalQuestion } from '../../interfaces/assignment/tasks';
import { TaskService } from '../../services/task.service';
import { MultipleChoiceTask, NormalQuestionTask, Task, TaskType } from '../../interfaces/tasks';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-assignment-page',
  imports: [AuthenticatedHeaderComponent, LearningPathComponent, MatSelectModule, MatFormFieldModule, MatOptionModule, CreateSubmissionComponent, MatProgressBar, MatCardModule, LoadingComponent, CreateTaskComponent],
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

  private _assignment?: Assignment;
  public graph: DirectedGraph<LearningObject> | undefined
  public progress!: Progress;
  public assignmentId!: string;
  public learningPathId: string = "";
  public language = "nl";
  public currentLearningObjectId!: string;
  public selectedNode: Node<LearningObject> | undefined;
  public step: number = 0;
  public furthestStep: number = 0; // This is the furthest progress point achieved
  public maxStep: number = 1;

  public isStudent!: boolean;

  public noTask!: boolean;
  public task!: Task | null;
  public taskType!: TaskType;
  public taskId!: string | null;
  public taskObject!: AssignmentTask;

  public constructor(
    private assignmentService: AssignmentService,
    private progressService: ProgressService,
    private authService: AuthenticationService,
    private learningPathService: LearningPathService,
    private taskService: TaskService,
  ) { }


  public get assignment(): Assignment | undefined {
    return this._assignment;
  }


  getProgressPercentage(): number {
    return (this.step / this.maxStep) * 100;
  }

  onSelectedNodeChanged(node: Node<LearningObject>) {
    this.currentLearningObjectId = node.value.metadata.hruid!;
    this.step = node.value.metadata.step!;

    this.taskFetched = false;
    this.fetchTask();
  }

  retrieveGraph(graph: DirectedGraph<LearningObject>) {
    this.graph = graph;
    this.selectedNode = graph.nodes[this.step];
  }

  onSubmissionCreated(): void {
    this.openSnackBar($localize`Submission created!`)
    this.learningPathComponent.goToNextNode();  // Execute goToNextNode in LearningPathComponent
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
      step: this.step,
      question: taskData.question,
      type: taskData.type,
      details: details
    }

    this.taskService.createTask(task).subscribe(
      (id) => {
        this.taskId = id;
        this.openSnackBar($localize`Task Succesfully Created!`);
        this.fetchTask();
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


  private fetchTask() {
    // See if there are any tasks already created
    this.taskService.getSpecificTaskOfAssignment(this.assignmentId, this.step).subscribe(
      (task) => {
        if (task) {
          this.noTask = false;
          this.task = task;
          this.taskType = task.type;
          this.taskId = task.id!;

          // Our internal components work with another object format
          this.taskObject = this.taskService.responseToObject(task);
          this.taskFetched = true;
        } else {
          this.noTask = true;
          this.task = null;
        }
      }
    )
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
          this._assignment = res;
          this.learningPathId = res.learningPathId;
          if (this._assignment && this.isStudent) {
            this.getProgress();
          } else if (!this.isStudent) {
            this.setupTeacher();
          }
          this.fetchTask();
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
