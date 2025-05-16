import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CreateAssignmentComponent } from '../../components/create-assignment/create-assignment.component';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';
import { LearningPathComponent } from '../../components/learning-path/learning-path.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-assignment-page',
  imports: [
    MatCardModule, CreateAssignmentComponent, AuthenticatedHeaderComponent, LearningPathComponent
  ],
  templateUrl: './create-assignment-page.component.html',
  styleUrl: './create-assignment-page.component.less',
  standalone: true
})
export class CreateAssignmentPageComponent implements OnInit {
  public learningPathId: string = "";
  public language: string = "nl";

  public showLearningPath = true;

  public constructor() { }

  // We'll read the ID straight from the url
  private readonly route = inject(ActivatedRoute);
  ngOnInit(): void {
    this.route.url.subscribe((segment) => {
      this.learningPathId = segment[2].path ? segment[2].path : "";
      this.language = segment[3].path ? segment[3].path : "nl";
    });
  }

  showGroups() {
    this.showLearningPath = false;
  }


}
