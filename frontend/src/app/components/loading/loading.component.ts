import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * This is just a small temporary component to show a loading page.
 */
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    // Angular material
    MatProgressSpinnerModule
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.less'
})
export class LoadingComponent {

}
