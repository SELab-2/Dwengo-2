import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-unauthenticated-header',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  templateUrl: './unauthenticated-header.component.html',
  styleUrl: './unauthenticated-header.component.less'
})
export class UnauthenticatedHeaderComponent {

  constructor(
    private router: Router,
  ) {}
  

  isOnRegisterRoute(): boolean {
    return this.router.url.endsWith('/register');
  }
  
}
