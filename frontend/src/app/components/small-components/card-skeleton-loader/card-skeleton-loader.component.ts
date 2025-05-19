import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-card-skeleton-loader',
  imports: [MatCardModule],
  templateUrl: './card-skeleton-loader.component.html',
  styleUrl: './card-skeleton-loader.component.less'
})
export class CardSkeletonLoaderComponent {
  @Input() title = "";

}
