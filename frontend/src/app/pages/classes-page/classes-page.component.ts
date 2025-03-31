import { Component, OnInit } from '@angular/core';
import { Class } from '../../interfaces/classes/class';
import { CommonModule } from "@angular/common";
import { ClassesService } from '../../services/classes.service';
import { CreateClassComponent } from '../../components/create-class/create-class.component';
import { MiniClassComponent } from '../../components/mini-class/mini-class.component';

import { MatList } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


// Type alias
type classFilterType = (c: Class) => boolean;

@Component({
  standalone: true,
  selector: 'app-classes-page',
  imports: [
    CommonModule,
    MiniClassComponent,
    CreateClassComponent,

    // Angular material
    MatList,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './classes-page.component.html',
  styleUrl: './classes-page.component.less'
})
export class ClassesPageComponent implements OnInit {

  // Class filter used in the `classes` getter
  // By default we don't filter any classes (return true)
  // You can specify this function all you want as long as it returns a boolean
  private classFilter: classFilterType = () => true;

  // Classes of the currently logged in user
  private _classes: Class[] = [];

  // To show the create component or not
  showCreate: boolean = false;

  constructor(
    private classesService: ClassesService
  ) {}

  /**
   * We fetch the classes here since Angular getters shouldn't be async.
   * If we do we get the equivalent of a forkbomb.
   */
  public ngOnInit(): void {
    this.classesService
      .classesOfUser()
      .subscribe({
        next: (classes) => this._classes = classes,
        error: (err) => window.alert(err)
      });
  }

  /**
   * Create a class by letting the user fill in a form and send it to the API
   */
  public createClass(): void {
    this.showCreate = !this.showCreate;
  }

  /**
   * Filter the classes by a name, 
   * filter passes as long as the class name contains the given name.
   * @param name Name of the class
   */
  public classNameFilter(name: string) {
    const lowerCaseName = name.toLowerCase();
    this.classFilter = (c: Class) => c
      .name
      .toLowerCase()
      .includes(lowerCaseName);
  }

  /**
   * Get all classes of the currently logged in user.
   * Applies the currently installed filter.
   */
  public get classes(): Class[] {

    // window.alert("Fetching classes...");

    // this.classesService.classesOfUSer()
    //   .pipe()
    //   .subscribe((classesReponse) => {
    //     if(classesReponse) classes = classesReponse;
    //   });
    return this._classes.filter(this.classFilter);
  }

}
