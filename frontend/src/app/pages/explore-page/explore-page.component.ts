import { Component } from '@angular/core';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';
import { ExploreComponent } from '../../components/explore/explore.component';

@Component({
    selector: 'app-explore-page',
    standalone: true,
    imports: [AuthenticatedHeaderComponent, ExploreComponent],
    templateUrl: './explore-page.component.html',
    styleUrl: './explore-page.component.less'
})
export class ExplorePageComponent {

}
