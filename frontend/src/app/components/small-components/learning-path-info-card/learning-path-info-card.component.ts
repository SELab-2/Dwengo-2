import { Component, Input, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-learning-path-info-card",
    standalone: true,
    imports: [MatCardModule, MatIconModule, MatListModule, RouterLink, MatButtonModule],
    templateUrl: "./learning-path-info-card.component.html",
    styleUrls: ["./learning-path-info-card.component.less"],
})
export class LearningPathInfoCardComponent implements OnInit {
    @Input() title!: string;
    @Input() description!: string;
    @Input() steps!: number;
    @Input() minAge!: number;
    @Input() maxAge!: number;
    @Input() learningPathId!: string;
    @Input() isTeacher: boolean = false;

    ngOnInit(): void {
        this.description = this.description.length > 100 ? this.description.substring(0, 100) + "..." : this.description;
    }
}