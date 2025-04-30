import { Component, Input } from '@angular/core';
import { Class } from '../../interfaces/classes/class';
import { CommonModule } from '@angular/common'
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card'
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-mini-class',
  imports: [
    CommonModule,
    RouterLink,

    // Material design
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent
  ],
  templateUrl: './mini-class.component.html',
  styleUrl: './mini-class.component.less'
})
export class MiniClassComponent {
  @Input() _type: string = "teacher"; // or student

  // We get our class from somewhere else
  @Input() _class!: Class;

}
