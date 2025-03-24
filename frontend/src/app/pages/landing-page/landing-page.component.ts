import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [ 
    CommonModule,

    // For routing to other pages
    // Based on https://angular.dev/guide/routing/common-router-tasks
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.less'
})
export class LandingPageComponent {

}
