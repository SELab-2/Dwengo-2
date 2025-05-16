import { Component, Input, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterLink } from "@angular/router";
import { LearningPath } from "../../../interfaces/learning-path";

@Component({
    selector: "app-learning-path-info-card",
    standalone: true,
    imports: [MatCardModule, MatIconModule, MatListModule, RouterLink, MatButtonModule],
    templateUrl: "./learning-path-info-card.component.html",
    styleUrls: ["./learning-path-info-card.component.less"],
})
export class LearningPathInfoCardComponent implements OnInit {
    @Input() path!: LearningPath;
    @Input() isTeacher: boolean = false;

    ngOnInit(): void {
        this.checkLengths();
    }

    checkLengths = (): void => {
        this.path.description = this.path.description.length > 100 ? this.path.description.substring(0, 100) + "..." : this.path.description;
        this.path.title = this.path.title.length > 40 ? this.path.title.substring(0, 40) + "..." : this.path.title;
    }

}