import { Component, Input } from '@angular/core';
import { Class } from '../../interfaces/classes/class';
import { CommonModule } from '@angular/common'
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card'

@Component({
  standalone: true,
  selector: 'app-mini-class',
  imports: [
    CommonModule,

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

  // We get our class from somewhere else
  @Input() _class!: Class;

}
