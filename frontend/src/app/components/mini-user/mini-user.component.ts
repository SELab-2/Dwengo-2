import { Component, Input } from '@angular/core';
import { User } from '../../interfaces';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-mini-user',
  standalone: true,
  imports: [
    // Angular material
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIcon,
    MatTooltip,
    MatDivider,
    MatExpansionModule
    
  ],
  templateUrl: './mini-user.component.html',
  styleUrl: './mini-user.component.less'
})
export class MiniUserComponent {

  @Input() user!: User;

}
