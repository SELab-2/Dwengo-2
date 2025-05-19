import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../../interfaces/group/group';
import { GroupService } from '../../services/group.service';
import { AuthenticatedHeaderComponent } from '../authenticated-header/authenticated-header.component';
import { MiniUserComponent } from '../mini-user/mini-user.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-group',
  imports: [
    AuthenticatedHeaderComponent,
    MiniUserComponent
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.less'
})
export class GroupComponent implements OnInit {

  // Snackbar
  private snackbar = inject(MatSnackBar);

  // The currently activated route
  private readonly route = inject(ActivatedRoute);

  // The group represented by this component
  private _group?: Group;

  public constructor(
    private groupService: GroupService
  ) {}

  /**
   * Initialization of this component: Gets the group from the API
   */
  public ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if(id) {
      const group$ = this.groupService.getGroup(id);
      group$.subscribe(response => this._group = response);
    } else {
      this.openSnackBar($localize`:@@cannotOpenRead:Cannot read group id from URL`);
    }
  }

  public get group(): Group | undefined {
    return this._group;
  }

  private openSnackBar(message: string, action: string="Ok") {
    this.snackbar.open(message, action, {
        duration: 2500
    });
  }

}
