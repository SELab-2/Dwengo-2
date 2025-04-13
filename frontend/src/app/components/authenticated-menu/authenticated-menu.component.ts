import { Component, Input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-authenticated-menu',
  imports: [MatButtonModule, MatMenuModule, RouterLink],
  templateUrl: './authenticated-menu.component.html',
  styleUrl: './authenticated-menu.component.less'
})
export class AuthenticatedMenuComponent {
  @Input() isStudent: boolean = false;

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  openMenu() {
    this.trigger.openMenu();
  }
  
}
