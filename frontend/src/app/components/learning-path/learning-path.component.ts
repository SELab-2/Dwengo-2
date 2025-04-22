import { Component, Input, OnInit } from "@angular/core";
import { LearningPath } from "../../interfaces/learning-path";
import { AuthenticationService } from "../../services/authentication.service";
import { UserType } from "../../interfaces";

@Component({
    selector: "app-learning-path-component",
    templateUrl: "learning-path.component.html",
    styleUrl: "learning-path.component.less",
    standalone: true,
    imports: [],
})
export class LearningPathComponent implements OnInit {
    @Input() path!: LearningPath;

    isTeacher: boolean = false;

    constructor(private authService: AuthenticationService) { }

    ngOnInit(): void {
        this.isTeacher = this.authService.retrieveUserType() === UserType.TEACHER;
    }
}