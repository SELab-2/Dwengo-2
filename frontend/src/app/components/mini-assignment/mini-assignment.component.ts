import { Component, Input } from '@angular/core';
import { Assignment } from '../../interfaces/assignment/assignment';
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card'
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GroupDialogComponent } from '../group-dialog/group-dialog.component';
import { Group } from '../../interfaces/group/group';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Progress } from '../../interfaces/progress/progress';
import { ProgressService } from '../../services/progress.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatTooltip } from '@angular/material/tooltip';

enum Urgence {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}
@Component({
  standalone: true,
  selector: 'app-mini-assignment',
  imports: [
    CommonModule,

    // Material design
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltip
  ],
  templateUrl: './mini-assignment.component.html',
  styleUrl: './mini-assignment.component.less'
})
export class MiniAssignmentComponent {
  @Input() _type: string = "student"; // or teacher

  // We get our assignment from somewhere else
  @Input() assignment!: Assignment;
  @Input() group!: Group;
  @Input() progress!: Progress;
  today: Date = new Date();

  constructor(
    private dialog: MatDialog,
    private progressService: ProgressService,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  onCardClick(): void {
    if (!this.upcoming) {
      this.router.navigate(['/', this._type, 'assignments', this.assignment.id]);
    }
  }


  // Give event as param, so routerlink to assignment is not taken
  openDialog(event: MouseEvent) {
    event.stopPropagation();
    this.dialog.open(GroupDialogComponent, {
      data: this.group,
      minWidth: "25vw"
    })
  }

  get upcoming(): boolean {
    return new Date(this.assignment.startDate) > this.today
  }

  get progressPercentage(): number {
    return Math.round((this.progress.step / this.progress.maxStep) * 1000) / 10
  }

  get toolTip(): string {
    const now: Date = new Date();
    const diff = new Date(this.assignment.deadline).getTime() - now.getTime()

    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diff / (1000 * 60 * 60)) % 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} and ${diffHours} hours left`;
    } else {
      return `${diffHours} hours left`;
    }
  }

  get urgence(): string {
    const now: Date = new Date();
    const diff = new Date(this.assignment.deadline).getTime() - now.getTime()
    // Deadline in 24 hours, urgent 
    if (diff > 0 && diff <= 24 * 60 * 60 * 1000) {
      return Urgence.HIGH
    } else if (diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000) {
      // Deadline in 7 days, medium urgence 
      return Urgence.MEDIUM
    }
    return Urgence.LOW
  }
}
