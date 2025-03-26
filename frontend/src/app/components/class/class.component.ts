import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Class } from '../../interfaces/classes/class';
import { ClassesService } from '../../services/classes.service';

@Component({
  selector: 'app-class',
  imports: [
    CommonModule
  ],
  templateUrl: './class.component.html',
  styleUrl: './class.component.less'
})
export class ClassComponent {

  private readonly route = inject(ActivatedRoute);

  // The class
  _class?: Class;

  // Is the class of this component available from the services?
  available: Boolean = false;

  public constructor(
    private classesService: ClassesService
  ) {}

  public ngOnInit() {
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if(id) {
      const classObservable = this.classesService.classWithId(id);

      classObservable.pipe().subscribe(
        (response) => {
          if(response) {
            this.available = true;
            this._class = response;
          }
        }
      );
    } else {
      window.alert('Unable to retrieve id from this route');
    }
  }

}
