import { Component, Input, OnInit } from '@angular/core';
import { Class } from '../../interfaces/classes/class';
import { LoadingComponent } from '../loading/loading.component';
import { User } from '../../interfaces';
import { ClassesService } from '../../services/classes.service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-class-members-list',
  imports: [
    LoadingComponent,

    // Angular material
    MatTableModule
  ],
  templateUrl: './class-members-list.component.html',
  styleUrl: './class-members-list.component.less'
})
export class ClassMembersListComponent implements OnInit {

  // Input class
  @Input() _class?: Class;

  // Class members
  public members: User[] = [];

  // TODO: put "magic constant" field names in user interface
  displayedColumns: string[] = ['name', 'email', 'schoolName'];

  constructor(
    private classesService: ClassesService,
  ) {}

  public ngOnInit(): void {
    if(this._class) {
      this.classesService
        .classStudents(this._class.id)
        .subscribe(response => this.members = response)
    }
  }

}
