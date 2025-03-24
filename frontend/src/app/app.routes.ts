import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { TeacherDashboardPageComponent } from './pages/teacher-dashboard-page/teacher-dashboard-page.component';

/**
 * Routing of our frontend.
 * Based on https://angular.dev/guide/routing/common-router-tasks
 */
export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent },
    {
        path: 'teacher',
        children: [
            { path: 'dashboard', component: TeacherDashboardPageComponent },
            // Add future teacher routes here
        ]
    }
];
