import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Class } from '../../interfaces/classes/class';
import { ClassesService } from '../../services/classes.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-class',
  imports: [
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './class.component.html',
  styleUrl: './class.component.less'
})
export class ClassComponent {

  private readonly route = inject(ActivatedRoute);

  // The class
  _class?: Class;

  public constructor(
    private classesService: ClassesService
  ) {}

  public ngOnInit() {
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if(id) {
      const classObservable = this.classesService.classWithId(id);

      classObservable.pipe().subscribe(
        (response) => {
          if(response) this._class = response;
        }
      );
    } else {
      window.alert('Unable to retrieve id from this route');
    }
  }

}
