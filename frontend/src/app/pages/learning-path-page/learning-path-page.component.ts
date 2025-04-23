import { Component, OnInit } from "@angular/core";
import { AuthenticatedHeaderComponent } from "../../components/authenticated-header/authenticated-header.component";
import { ActivatedRoute, Router } from "@angular/router";
import { LearningPathComponent } from "../../components/learning-path/learning-path.component";

@Component({
    selector: "app-learning-path-page",
    templateUrl: "learning-path-page.component.html",
    styleUrl: "learning-path-page.component.less",
    standalone: true,
    imports: [AuthenticatedHeaderComponent, LearningPathComponent],
})
export class LearningPathPageComponent implements OnInit {
    hruid!: string | null;
    language!: string | null;
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Get all route parameters
        this.hruid = this.route.snapshot.paramMap.get('hruid');
        this.language = this.route.snapshot.paramMap.get('language');

        // Check if required parameters exist
        if (!this.hruid || !this.language) {
            this.router.navigate(['/explore']); // TODO: fix a smoother handling of wrong url params
            return;
        }

        this.loading = false;

    }

}