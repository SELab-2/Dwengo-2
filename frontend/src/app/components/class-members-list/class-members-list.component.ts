import { Component, Input, OnInit } from '@angular/core';
import { Class } from '../../interfaces/classes/class';
import { LoadingComponent } from '../loading/loading.component';
import { User, UserType } from '../../interfaces';
import { ClassesService } from '../../services/classes.service';
import { MatTableModule } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../../services/authentication.service';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-class-members-list',
  imports: [
    LoadingComponent,

    // Angular material
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './class-members-list.component.html',
  styleUrl: './class-members-list.component.less'
})
export class ClassMembersListComponent implements OnInit {

  // Input class
  @Input() _class?: Class;

  // Class members
  public members: User[] = [];

  // Table columns, is used by MatTableModule
  public displayedColumns: string[] = ['name', 'email', 'schoolName'];
  public displayedColumnsWithDelete: string[] = ['name', 'email', 'schoolName', 'delete'];

  constructor(
    private classesService: ClassesService,
    private authenticationService: AuthenticationService,
  ) {}

  /**
   * Retrieves the members for this class from the services.
   */
  public ngOnInit(): void {
    if(this._class) {
      this.classesService
        .classStudents(this._class.id)
        .subscribe(response => this.members = response);
    }
  }

  public deleteMember(member: User): void {
    if (this._class) {
      this.classesService
        .deleteUserFromClass(this._class.id, member.id)
        .subscribe(() => { 
          this.members = this.members.filter(m => m.id !== member.id);
        });
    }
  }

  public isTeacher(): boolean {
    return this.authenticationService.retrieveUserType() === UserType.TEACHER;
  }

}
