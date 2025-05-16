import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Class } from '../../../interfaces/classes/class';
import { ClassInfoCardComponent } from '../class-info-card/class-info-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
    selector: 'app-class-overview-widget',
    standalone: true,
    imports: [CommonModule, MatCardModule, ClassInfoCardComponent, MatIconModule, MatButtonModule, RouterLink, LoadingComponent],
    templateUrl: './class-overview-widget.component.html',
    styleUrls: ['./class-overview-widget.component.less']
})
export class ClassOverviewWidgetComponent {
    // Boolean that indicated if the classes are still loading
    @Input() loadingClasses: boolean = true;
    // Boolean that indicates if the completion data is still loading
    @Input() loadingData: boolean = true;
    @Input() classes: Class[] = [];
}
