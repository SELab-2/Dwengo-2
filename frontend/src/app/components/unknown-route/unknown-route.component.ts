import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unknown-route',
  imports: [RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './unknown-route.component.html',
  styleUrl: './unknown-route.component.less'
})
export class UnknownRouteComponent {

}
