import { Component, Input, OnInit } from '@angular/core';
import { Class } from '../../interfaces/classes/class';
import { JoinRequestService } from '../../services/join-request.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { JoinRequestWithUser } from '../../interfaces/join-requests/joinRequestWithUser';

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

  public constructor(
    private authService: AuthenticationService,
    private joinRequestService: JoinRequestService
  ) {}

  public ngOnInit() {
    const classId: string | null = this._class?.id || null;

    if(classId) {
      // Get all join requests
      const joinRequests$ = this.joinRequestService.getJoinRequestsForClass(classId);

      joinRequests$.subscribe(response => {
        console.log(response);

        // Fill users of those join requests
        const joinRequestWithUser$ = this.joinRequestService.fillUsers(response);
        joinRequestWithUser$.subscribe(joinRequests => {
          console.log(joinRequests);
          this.joinRequests = joinRequests;
        });

      });

    } else {
      window.alert("Error occured with ids"); // TODO
    }
  }

  public acceptRequest(requestId: string) {
    const accepted$ = this.joinRequestService.acceptRequest(requestId);

    accepted$.subscribe(response => {
      if(response) {
        window.alert("Accepted!");
      } else {
        window.alert("ERROR, RUN!");
      }
    });
  }

  public rejectRequest(requestId: string) {
    const rejected$ = this.joinRequestService.rejectRequest(requestId);

    rejected$.subscribe(response => {
      if(response) {
        window.alert("Rejected!");
      } else {
        window.alert("ERROR, RUN!");
      }
    });
  }

}
