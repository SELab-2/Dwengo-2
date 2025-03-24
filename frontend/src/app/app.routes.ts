import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

/**
 * Routing of our frontend.
 * Based on https://angular.dev/guide/routing/common-router-tasks
 */
export const routes: Routes = [
    { path: 'login', component: LandingPageComponent }, // TODO: Change to LoginComponent
    { path: 'register', component: LandingPageComponent }, // TODO: Change to RegisterComponent
];
