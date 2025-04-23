import { Component, Input } from '@angular/core';
import { GroupFilledIn } from '../../interfaces/group/groupFilledIn';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card'


@Component({
  selector: 'app-group-card',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent
  ],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.less'
})
export class GroupCardComponent {

  @Input() group!: GroupFilledIn;

}
