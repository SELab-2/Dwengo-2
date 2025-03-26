import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ClassesPageComponent } from './pages/classes-page/classes-page.component';

/**
 * Routing of our frontend.
 * Based on https://angular.dev/guide/routing/common-router-tasks
 */
export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent },
    { path: 'teacher/classes', component: ClassesPageComponent },
];
