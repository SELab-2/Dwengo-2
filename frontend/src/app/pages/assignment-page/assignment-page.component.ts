import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';
import { LearningPathComponent } from '../../components/learning-path/learning-path.component';
import { ActivatedRoute } from '@angular/router';
import { Assignment } from '../../interfaces/assignment';
import { AssignmentService } from '../../services/assignment.service';
import { QuestionThreadService } from '../../services/questionThread.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CreateSubmissionComponent } from '../../components/create-submission/create-submission.component';
import { LearningObject } from '../../interfaces/learning-object';
import { Node } from "../../datastructures/directed-graph";
import { ProgressService } from '../../services/progress.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Progress } from '../../interfaces/progress/progress';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { LoadingComponent } from '../../components/loading/loading.component';
import { UserType } from '../../interfaces';
import { LearningPathService } from '../../services/learningPath.service';
import { SpecificLearningPathRequest } from '../../interfaces/learning-path';
import { CreateTaskComponent, TaskType } from '../../components/create-task/create-task-component/create-task.component';
import { AssignmentTask, MultipleChoice } from '../../interfaces/assignment/tasks';
import { ChatComponent } from '../../components/chat/chat.component';
import { TemplateRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { QuestionThread } from '../../interfaces/questionThread';

@Component({
  selector: 'app-assignment-page',
  standalone: true,
  imports: [
    AuthenticatedHeaderComponent,
    LearningPathComponent,
    CreateSubmissionComponent,
    MatProgressBar,
    MatCardModule,
    LoadingComponent,
    CreateTaskComponent,
    ChatComponent,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
  ],
  templateUrl: './assignment-page.component.html',
  styleUrl: './assignment-page.component.less'
})
export class AssignmentPageComponent implements OnInit {
  @ViewChild(LearningPathComponent) learningPathComponent!: LearningPathComponent;
  @ViewChild('chatDialog') chatDialog!: TemplateRef<unknown>;

  // The current activated route
  private readonly route = inject(ActivatedRoute);

  private readonly snackBar = inject(MatSnackBar);
  private readonly invalidURLMessage = $localize`Invalid URL`;
  private readonly closeMessage = $localize`Close`;
  private chatDialogRef?: MatDialogRef<unknown>;
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
  public currentThreadId: string = "";
  public isChatOpen = false;

  public isStudent!: boolean;


  public constructor(
    private assignmentService: AssignmentService,
    private progressService: ProgressService,
    private authService: AuthenticationService,
    private learningPathService: LearningPathService,
    private chatService: QuestionThreadService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private router: Router,
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
    console.log(task);
    this.openSnackBar($localize`Task Succesfully Created!`);
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

  // TODO: implement
  private setupSubmission(): void {
    // only show submission when its created
    this.taskType = TaskType.MultipleChoice;
    this.taskObject = {
      question: "Test Question",
      allowMultipleAnswers: true,
      options: ["Test answer 1", "Some longer test answer to check if this is actually a good format and all that, because maybe it is not.", "Test answer 3"],
      selected: [],
      correctAnswers: [0, 2]
    } as MultipleChoice
    // this.taskObject = {
    //   question: "What is 1 + 1",
    //   predefined_answer: "2",
    // } as NormalQuestion; // Cast the AssignmentTask to what we need

    this.taskFetched = true;
  }

  public async checkOrCreateThread() {
    console.log("checkOrCreateThread called. assignmentId:", this.assignmentId, "currentLearningObjectId:", this.currentLearningObjectId);

    if (!this.assignmentId) {
        console.warn("Cannot check/create thread: assignmentId is missing.");
        this.currentThreadId = "new"; // Default if essential ID is missing
        return;
    }

    // If currentLearningObjectId is empty, it means we can't find a thread for a specific step.
    // In this context, it should be treated as a "new" thread.
    if (!this.currentLearningObjectId) {
        console.warn("currentLearningObjectId is missing in checkOrCreateThread. Setting currentThreadId to 'new'.");
        this.currentThreadId = "new";
        return;
    }

    this.chatService.retrieveQuestionThreadByStep(
        this.assignmentId,
        this.currentLearningObjectId
    ).subscribe({
        next: (thread: QuestionThread | null) => { // Expect QuestionThread or null
            console.log("Thread received from service in checkOrCreateThread:", thread);
            if (thread && thread.id) {
                this.currentThreadId = thread.id;
            } else {
                // Handles null response or thread object without an id
                this.currentThreadId = "new";
            }
            console.log("currentThreadId in assignment page set to:", this.currentThreadId);
        },
        error: (err: any) => {
            console.error("Error in retrieveQuestionThreadByStep subscription:", err);
            this.currentThreadId = "new"; // Fallback on error
            console.log("currentThreadId in assignment page set to 'new' due to error.");
        }
    });
  }

  async openChat() {
    if (this.isChatOpen) {
      this.closeChat();
      return;
    }

    await this.checkOrCreateThread();

    this.chatDialogRef = this.dialog.open(this.chatDialog, {
      width: '400px',
      height: '600px',
      panelClass: 'chat-dialog-container',
      position: { bottom: '80px', right: '20px' },
      hasBackdrop: false,
      disableClose: true, // Prevents closing by clicking outside
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      autoFocus: false
    });

    this.isChatOpen = true;
    
    this.chatDialogRef.afterClosed().subscribe(() => {
      this.isChatOpen = false;
    });
  }

  closeChat() {
    if (this.chatDialogRef) {
      this.chatDialogRef.close();
    }
  }

  navigateToFullChat() {
    this.closeChat();
    this.router.navigate(['/student/chat', this.currentThreadId]);
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
