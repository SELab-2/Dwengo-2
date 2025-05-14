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

  // Input class
  @Input() _class?: Class;

  // Join requests for this class
  public joinRequests: JoinRequestWithUser[] = [];

  // Messages for the snackbar
  private readonly acceptedMessage: string = $localize `:@@accepted:Accepted!`;
  private readonly rejectedMessage: string = $localize `:@@rejected:Rejected!`;

  // Snackbar
  private readonly snackBar = inject(MatSnackBar);

  public constructor(
    private joinRequestService: JoinRequestService
  ) {}

  /**
   * Requests the join requests for this class 
   * and fills it with the data of the users making the requesting
   */
  public ngOnInit(): void {
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

  /**
   * Accept a join request with a certain id
   * @param requestId The id of the join request to accept
   */
  public acceptRequest(requestId: string): void {
    const accepted$ = this.joinRequestService.acceptRequest(requestId);

    accepted$.subscribe((response) => {
      if(response) this.openSnackBar(this.acceptedMessage);
      window.location.reload();
    });
  }

  /**
   * Reject a join request with a certain id
   * @param requestId The id of the join request to reject
   */
  public rejectRequest(requestId: string): void {
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
