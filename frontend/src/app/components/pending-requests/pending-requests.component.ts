import { Component, Input, OnInit } from '@angular/core';
import { Class } from '../../interfaces/classes/class';
import { JoinRequest } from '../../interfaces/join-requests/joinRequest';
import { JoinRequestService } from '../../services/join-request.service';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../interfaces';
import { UserService } from '../../services/user.service';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-pending-requests',
  imports: [
    // Angular material
    MatMiniFabButton,
    MatIcon
  ],
  templateUrl: './pending-requests.component.html',
  styleUrl: './pending-requests.component.less'
})
export class PendingRequestsComponent implements OnInit {

  @Input() _class?: Class;

  public joinRequests: JoinRequest[] = [];

  public constructor(
    private authService: AuthenticationService,
    private joinRequestService: JoinRequestService,
    private userService: UserService
  ) {}

  public ngOnInit() {
    const userId: string | null = this.authService.retrieveUserId();
    const classId: string | null = this._class?.id || null;

    if(classId && userId) {
      const joinRequests$ = this.joinRequestService.getJoinRequestsFromUserForClass(
        userId,
        classId
      );

      joinRequests$.subscribe(response => 
        this.joinRequests = response
      );
    } else {
      window.alert("Error occured with ids"); // TODO
    }
  }

}
