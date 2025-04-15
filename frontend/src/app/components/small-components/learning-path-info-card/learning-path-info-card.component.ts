import { Component, Input, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterLink } from "@angular/router";
import { AuthenticationService } from "../../../services/authentication.service";

@Component({
    selector: "app-learning-path-info-card",
    standalone: true,
    imports: [MatCardModule, MatIconModule, MatListModule, RouterLink, MatButtonModule],
    templateUrl: "./learning-path-info-card.component.html",
    styleUrls: ["./learning-path-info-card.component.less"],
})
export class LearningPathInfoCardComponent {
    @Input() title!: string;
    @Input() description!: string;
    @Input() steps!: number;
    @Input() minAge!: number;
    @Input() maxAge!: number;
    @Input() learningPathId!: string;
    @Input() isTeacher: boolean = false;

}