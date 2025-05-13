import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';

@Component({
  selector: 'app-unauthenticated-header',
  standalone: true,
  imports: [RouterLink, MatButtonModule, LanguageSelectorComponent],
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
