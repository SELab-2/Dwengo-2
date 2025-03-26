import { Component } from '@angular/core';
import { Class } from '../../interfaces/classes/class';
import { CommonModule } from "@angular/common";

// Type alias
type classFilterType = (c: Class) => Boolean;

@Component({
  standalone: true,
  selector: 'app-classes-page',
  imports: [
    CommonModule
  ],
  templateUrl: './classes-page.component.html',
  styleUrl: './classes-page.component.less'
})
export class ClassesPageComponent {

  // Class filter used in the `classes` getter
  // By default we don't filter any classes (return true)
  // You can specify this function all you want as long as it returns a boolean
  private classFilter: classFilterType = (c: Class) => true;

  /**
   * Create a class by letting the user fill in a form and send it to the API
   */
  public createClass(): void {
    window.alert("Create class");
  }

  /**
   * Filter the classes by a name, 
   * filter passes as long as the class name contains the given anme
   * @param name Name of the class
   */
  public classNameFilter(name: string) {
    this.classFilter = (c: Class) => c.name.includes(name);
  }

  /**
   * Get all classes of the currently logged in user
   * Applies `classFilter`
   */
  public get classes(): Class[] {
    const classes = [
      {
        name: "Math",
        description: "Mathematics",
        targetAudience: "Students",
        teacherId: "123",
        classId: "321"
      }
    ];

    return classes.filter(this.classFilter);
  }

}
