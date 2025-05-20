import { Component, Input, OnInit } from '@angular/core';
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
export class MiniUserComponent implements OnInit {
  @Input() user!: User;


  ngOnInit(): void {
    this.user.firstName = this.user.firstName.length > 15 ? `${this.user.firstName.slice(0, 13)}...` : this.user.firstName;
    this.user.familyName = this.user.familyName.length > 15 ? `${this.user.familyName.slice(0, 13)}...` : this.user.familyName;
  }
}
