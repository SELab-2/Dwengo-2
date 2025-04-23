import { Component, Input } from '@angular/core';
import { GroupFilledIn } from '../../interfaces/group/groupFilledIn';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card'
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-group-card',
  imports: [
    RouterLink,

    // Angular material
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
