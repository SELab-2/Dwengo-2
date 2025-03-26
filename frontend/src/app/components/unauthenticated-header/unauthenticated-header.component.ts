import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthenticated-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './unauthenticated-header.component.html',
  styleUrl: './unauthenticated-header.component.less'
})
export class UnauthenticatedHeaderComponent {

}
