import { Component } from "@angular/core";
import { AuthenticatedHeaderComponent } from "../../components/authenticated-header/authenticated-header.component";

@Component({
    selector: "app-learning-path-page",
    templateUrl: "learning-path-page.component.html",
    styleUrl: "learning-path-page.component.less",
    standalone: true,
    imports: [AuthenticatedHeaderComponent],
})
export class LearningPathPageComponent {

}