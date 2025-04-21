import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { LearningPath, LearningPathRequest } from '../../interfaces/learning-path';
import { LearningPathListComponent } from '../small-components/learning-path-list/learning-path-list.component';
import { LearningPathService } from '../../services/learningPath.service';
import { LoadingComponent } from '../loading/loading.component';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { LearningPathFilterComponent } from '../small-components/learning-path-filter/learning-path-filter.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

interface CategorizedLearningPath extends LearningPath {
    category: string;
}



@Component({
    selector: 'app-explore',
    standalone: true,
    imports: [LearningPathListComponent, LoadingComponent, FormsModule, LearningPathFilterComponent, MatCardModule, MatButtonModule],
    templateUrl: './explore.component.html',
    styleUrl: './explore.component.less'
})
export class ExploreComponent implements OnInit {
    @Input() isTeacher: boolean = false;
    learningPaths: LearningPath[] = [];
    loading: boolean = true;
    visualize: string = "SELECT";

    // The only thing you need to change to add a new category is to add it to the categories array and the title array.
    categories: string[] = ["maths", "climate", "robot", "AI", "elek"];
    titles: string[] = [$localize`Maths`, $localize`Climate`, $localize`Robotics`, $localize`AI & Machine Learning`, $localize`Electronics`, $localize`Other Paths`];

    // The learning paths are categorized into different categories for better organization and filtering.
    data: CategorizedLearningPath[] = [];


    constructor(private authService: AuthenticationService, private learningPathService: LearningPathService) { }

    ngOnInit(): void {
        this.isTeacher = this.authService.retrieveUserType() === "teacher";

    }

    setVisual(state: string): void {
        if (this.visualize === state) return;

        if (state === 'BASIC') {
            this.loading = true;
            this.getRegularSelection();
            this.visualize = state;
        }
    }

    getLearningPathsByCategory(category: string): CategorizedLearningPath[] {
        return this.data.filter(lp => lp.category === category);
    }


    getRegularSelection(): void {
        const observables = this.categories.map(category => {
            const query: LearningPathRequest = { all: category };
            return this.learningPathService.retrieveLearningPathsByQuery(query);
        });

        forkJoin(observables).subscribe({
            next: (responses) => {
                this.data = responses.flatMap((response, index) =>
                    response.learningPaths.map(path => ({
                        ...path,
                        category: this.categories[index]
                    }))
                );
                this.loading = false;
            },
            error: (err) => {
                console.error("Failed to load one or more categories", err);
                this.loading = false;
            }
        });
    }

    onFiltersApplied(filters: { minAge: number | null, maxAge: number | null, language: string, searchTerm: string }) {
        this.visualize = "CUSTOM";
        this.loading = true;
        const query = {
            language: filters.language,
            all: filters.searchTerm,
        } as LearningPathRequest

        const obs = this.learningPathService.retrieveLearningPathsByQuery(query);
        obs.subscribe((response) => {
            console.log(response)
            this.data = response.learningPaths
                .filter(path => (!filters.minAge || filters.minAge <= path.minAge) && (!filters.maxAge || path.maxAge <= filters.maxAge))
                .map(path => {
                    return {
                        ...path,
                        category: "query",
                    };
                });
            this.loading = false;
        });


    }

}
