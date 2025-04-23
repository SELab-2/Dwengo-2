import { Component } from "@angular/core";
import { AuthenticatedHeaderComponent } from "../../components/authenticated-header/authenticated-header.component";
import { LearningPath, SpecificLearningPathRequest } from "../../interfaces/learning-path";
import { ActivatedRoute, Router } from "@angular/router";
import { LearningPathService } from "../../services/learningPath.service";
import { LearningPathComponent } from "../../components/learning-path/learning-path.component";

@Component({
    selector: "app-learning-path-page",
    templateUrl: "learning-path-page.component.html",
    styleUrl: "learning-path-page.component.less",
    standalone: true,
    imports: [AuthenticatedHeaderComponent, LearningPathComponent],
})
export class LearningPathPageComponent {
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
            this.router.navigate(['/explore']); // TODO: fix so it does not redirect to explore page directly
            return;
        }

        this.loading = false;

    }

}