import { Component, Input } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { User } from '../../interfaces';
import { MiniUserComponent } from '../mini-user/mini-user.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-create-group',
  imports: [
    MiniUserComponent,

    // Angular material
    CdkDropList,
    CdkDrag,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.less'
})
export class CreateGroupComponent {

  emptyGroup: User[] = [];

  @Input() assignmentId?: string = "123"; // TODO: change to Assignment
  @Input() members: User[] = [
    { id: '1', firstName: 'Alice', familyName: 'Smith', email: 'alice@school.com', schoolName: 'School', passwordHash: 'pass1' },
    { id: '2', firstName: 'Bob', familyName: 'Brown', email: 'bob@school.com', schoolName: 'School', passwordHash: 'pass2' }
  ];
  
  @Input() _groups: User[][] = [
    [{ id: '3', firstName: 'Charlie', familyName: 'Jones', email: 'charlie@school.com', schoolName: 'School', passwordHash: 'pass3' }],
    [{ id: '3', firstName: 'Jone', familyName: 'Jones', email: 'charlie@school.com', schoolName: 'School', passwordHash: 'pass3' }]
  ];

  public get groups() {
    return this._groups;
  }

  public newGroupList() {
    this._groups.push([]);
  }

  public deleteGroupList(index: number) {
    this._groups.splice(index, 1);
  }

  public addMemberToGroupList(index: number, member: User) {
    this._groups[index].push(member);
  }

  public drop(event: CdkDragDrop<User[]>) {
    const from = event.previousContainer;
    const to = event.container;
  
    console.log(to.id);

    // TODO: this code is very ugly, fix it
    if (to.id === "new-group") {
      console.log("new");

      const userIndex = event.previousIndex;
      const newGroup = [from.data[userIndex]];

      if(from.id === "members-list") {
        this.members.splice(userIndex, 1);
      } else {
        const groupIndex: number = Number.parseInt(from.id.split('-')[2]);
        this._groups[groupIndex].splice(userIndex, 1);
      }
      

      this._groups.push(newGroup);
    }
    else if (from === to) {
      moveItemInArray(to.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        from.data,
        to.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  public get connectedDropLists(): string[] {
    return ['members-list', 'new-group', ...this.groups.map((_, i) => `group-list-${i}`)];
  }

}
