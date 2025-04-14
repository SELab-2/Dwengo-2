import { Component, inject, Input, OnInit } from '@angular/core';
import { Class } from '../../interfaces/classes/class';
import { JoinRequestService } from '../../services/join-request.service';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { JoinRequestWithUser } from '../../interfaces/join-requests/joinRequestWithUser';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-class-pending-requests',
  standalone: true,
  imports: [
    // Angular material
    MatMiniFabButton,
    MatIcon
  ],
  templateUrl: './class-pending-requests.component.html',
  styleUrl: './class-pending-requests.component.less'
})
export class ClassPendingRequestsComponent implements OnInit {

  @Input() _class?: Class;

  public joinRequests: JoinRequestWithUser[] = [];

  private readonly acceptedMessage: string = $localize `Accepted!`;
  private readonly rejectedMessage: string = $localize `Rejected!`;

  // Snackbar
  private readonly snackBar = inject(MatSnackBar);

  public constructor(
    private joinRequestService: JoinRequestService
  ) {}

  public ngOnInit() {
    const classId: string | null = this._class?.id || null;

    if(classId) {
      // Get all join requests
      const joinRequests$ = this.joinRequestService.getJoinRequestsForClass(classId);

      joinRequests$.subscribe(response => {

        // Fill users of those join requests
        const joinRequestWithUser$ = this.joinRequestService.fillUsers(response);
        joinRequestWithUser$.subscribe(joinRequests => {
          console.log(joinRequests);
          this.joinRequests = joinRequests;
        });

      });
    }
  }

  public acceptRequest(requestId: string) {
    const accepted$ = this.joinRequestService.acceptRequest(requestId);

    accepted$.subscribe((response) => {
      if(response) this.openSnackBar(this.acceptedMessage);
      window.location.reload();
    });
  }

  public rejectRequest(requestId: string) {
    const rejected$ = this.joinRequestService.rejectRequest(requestId);

      rejected$.subscribe((response) => {
        if(response) this.openSnackBar(this.rejectedMessage);
        window.location.reload();
      });
  }

  private openSnackBar(message: string, action: string="Ok") {
    this.snackBar.open(message, action, {
        duration: 2500
    });
  }

}
