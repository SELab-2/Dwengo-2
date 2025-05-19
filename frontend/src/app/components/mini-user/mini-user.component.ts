import { Component, Input } from '@angular/core';
import { User } from '../../interfaces';
import { MatCardTitle } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-mini-user',
  standalone: true,
  imports: [
    // Angular material
    MatCardTitle,
    MatIcon,
    MatDivider,
    MatExpansionModule

  ],
  templateUrl: './mini-user.component.html',
  styleUrl: './mini-user.component.less'
})
export class MiniUserComponent {

  @Input() user!: User;

}
