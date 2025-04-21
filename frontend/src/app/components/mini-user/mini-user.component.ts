import { Component, Input } from '@angular/core';
import { User } from '../../interfaces';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card'

@Component({
  selector: 'app-mini-user',
  standalone: true,
  imports: [
    // Angular material
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent
  ],
  templateUrl: './mini-user.component.html',
  styleUrl: './mini-user.component.less'
})
export class MiniUserComponent {

  @Input() user!: User;

}
