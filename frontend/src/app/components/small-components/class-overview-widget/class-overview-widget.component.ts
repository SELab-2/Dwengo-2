import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Class } from '../../../interfaces/classes/class';
import { ClassInfoCardComponent } from '../class-info-card/class-info-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-class-overview-widget',
    standalone: true,
    imports: [CommonModule, MatCardModule, ClassInfoCardComponent, MatIconModule, MatButtonModule, RouterLink],
    templateUrl: './class-overview-widget.component.html',
    styleUrls: ['./class-overview-widget.component.less']
})
export class ClassOverviewWidgetComponent {
    @Input() classes: Class[] = [];
}
