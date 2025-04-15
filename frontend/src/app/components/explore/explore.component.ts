import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { LearningPath, LearningPathRequest } from '../../interfaces/learning-path';
import { LearningPathListComponent } from '../small-components/learning-path-list/learning-path-list.component';
import { LearningPathService } from '../../services/learningPath.service';
import { LoadingComponent } from '../loading/loading.component';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';


interface CategorizedLearningPath extends LearningPath {
    category: string;
}


@Component({
    selector: 'app-explore',
    standalone: true,
    imports: [LearningPathListComponent, LoadingComponent, FormsModule],
    templateUrl: './explore.component.html',
    styleUrl: './explore.component.less'
})
export class ExploreComponent implements OnInit {
    @Input() isTeacher: boolean = false;
    learningPaths: LearningPath[] = [];
    loading: boolean = true;

    // Filtering
    filterOptions: LearningPathRequest = {};
    minAge: number | null = null;
    maxAge: number | null = null;
    language: string = "";

    // The only thing you need to change to add a new category is to add it to the categories array and the title array.
    categories: string[] = ["maths", "climate", "robot", "AI", "elek"];
    titles: string[] = [$localize`Maths`, $localize`Climate`, $localize`Robotics`, $localize`AI & Machine Learning`, $localize`Electronics`, $localize`Other Paths`];

    // The learning paths are categorized into different categories for better organization and filtering.
    rawData: CategorizedLearningPath[] = [];
    data: CategorizedLearningPath[] = [];


    constructor(private authService: AuthenticationService, private learningPathService: LearningPathService) { }

    ngOnInit(): void {
        this.isTeacher = this.authService.retrieveUserType() === "teacher";

        const observables = this.categories.map(category => {
            const query: LearningPathRequest = { all: category };
            return this.learningPathService.retrieveLearningPathsByQuery(query);
        });

        forkJoin(observables).subscribe({
            next: (responses) => {
                this.rawData = responses.flatMap((response, index) =>
                    response.learningPaths.map(path => ({
                        ...path,
                        category: this.categories[index]
                    }))
                );
                this.filterData();
                this.loading = false;
            },
            error: (err) => {
                console.error("Failed to load one or more categories", err);
                this.loading = false;
            }
        });

    }

    filterData(): void {
        this.data = this.rawData.filter(path => {
            const matchMinAge = this.minAge === null || path.minAge >= this.minAge;
            const matchMaxAge = this.maxAge === null || path.maxAge <= this.maxAge;
            const matchLanguage = this.language === "" || path.language === this.language;
            return matchMinAge && matchMaxAge && matchLanguage;
        });
    }

    getLearningPathsByCategory(category: string): CategorizedLearningPath[] {
        return this.data.filter(lp => lp.category === category);
    }



}
