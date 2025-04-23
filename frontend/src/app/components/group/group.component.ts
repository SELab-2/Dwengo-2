import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupWithUsers } from '../../interfaces/group/groupWithUsers';
import { GroupService } from '../../services/group.service';
import { AuthenticatedHeaderComponent } from '../authenticated-header/authenticated-header.component';
import { MiniUserComponent } from '../mini-user/mini-user.component';


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

  // The currently activated route
  private readonly route = inject(ActivatedRoute);

  // The group represented by this component
  // TODO: assignment should also be filled in
  private _group?: GroupWithUsers;

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
      // TODO
    }
  }

  public get group(): GroupWithUsers | undefined {
    return this._group;
  }

}
