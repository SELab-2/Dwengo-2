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
import { UserType } from '../../interfaces';
import { CardSkeletonLoaderComponent } from '../small-components/card-skeleton-loader/card-skeleton-loader.component';

interface CategorizedLearningPath extends LearningPath {
    category: string;
}

enum ExploreSetting {
    SELECT = "SELECT",
    BASIC = "BASIC",
    CUSTOM = "CUSTOM",
}

// These are the categories and their respective titles.
const CATEGORY_CONFIGS: { key: string; title: string }[] = [
    { key: "maths", title: $localize `:@@Maths:Maths` },
    { key: "climate-bio-microsc", title: $localize `:@@Climate:Climate` },
    { key: "robot", title: $localize `:@@Robotics:Robotics` },
    { key: "AI", title: $localize `:@@AIML:AI & Machine Learning` },
    { key: "elek", title: $localize `:@@Electronics:Electronics` },
];

/**
 * The Explore Component
 * 
 * A way for people to interact and discover Learning Paths. Use the suggested selection or search your own paths.
 */
@Component({
    selector: 'app-explore',
    standalone: true,
    imports: [LearningPathListComponent, LoadingComponent, FormsModule, LearningPathFilterComponent, MatCardModule, MatButtonModule, CardSkeletonLoaderComponent],
    templateUrl: './explore.component.html',
    styleUrl: './explore.component.less'
})
export class ExploreComponent implements OnInit {
    @Input() isTeacher: boolean = false;
    learningPaths: LearningPath[] = [];
    loading: boolean = true;

    // This will display the selected visualization. It could be done by an enum, but this does the job.
    // Use "SELECT" when nothing is decided yet, "BASIC" for our suggested categories, "CUSTOM" to apply your own filters
    visualize: ExploreSetting = ExploreSetting.SELECT;


    categoryConfigs = CATEGORY_CONFIGS;

    // The learning paths are categorized into different categories for better organization and filtering.
    data: CategorizedLearningPath[] = [];


    constructor(private authService: AuthenticationService, private learningPathService: LearningPathService) { }

    ngOnInit(): void {
        // We'll need this to display the *plus* sign on the learning path cards
        this.isTeacher = this.authService.retrieveUserType() === UserType.TEACHER;
    }

    /**
     * Function to apply our suggested categories
     */
    setBasic(): void {
        if (this.visualize === ExploreSetting.BASIC) return;

        this.loading = true;
        this.getRegularSelection();
        this.visualize = ExploreSetting.BASIC;
    }

    /**
     * Helpfunction to filter each category
     * @param category the category to be filtered
     */
    getLearningPathsByCategory(category: string): CategorizedLearningPath[] {
        return this.data.filter(lp => lp.category === category);
    }

    /**
     * Help function to collect the learning paths for each main category.
     */
    getRegularSelection(): void {
        const observables = this.categoryConfigs.map(cfg => {
            const query: LearningPathRequest = { all: cfg.key };
            return this.learningPathService.retrieveLearningPathsByQuery(query);
        });


        forkJoin(observables).subscribe({
            next: (responses) => {
                this.data = responses.flatMap((response, index) =>
                    response.learningPaths.map(path => ({
                        ...path,
                        category: this.categoryConfigs[index].key
                    }))
                );
                this.loading = false;
            }
        });
    }

    /**
     * Function to handle the set filters in the LearningPathFilterComponent.
     * @param filters the possible filters to take into account.
     */
    setCustom(filters: { minAge: number | null, maxAge: number | null, language: string, searchTerm: string }) {
        this.visualize = ExploreSetting.CUSTOM;
        this.loading = true;
        const query = {
            language: filters.language,
            all: filters.searchTerm,
        } as LearningPathRequest

        const obs = this.learningPathService.retrieveLearningPathsByQuery(query);
        obs.subscribe((response) => {
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
