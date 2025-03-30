import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { UnknownRouteComponent } from './components/unknown-route/unknown-route.component';

/**
 * Routing of our frontend.
 * Based on https://angular.dev/guide/routing/common-router-tasks
 */
export const routes: Routes = [
    { path: '', component: LandingPageComponent, title: 'Landing Page' },
    { path: 'login', component: LoginPageComponent, title: 'Login' },
    { path: 'register', component: RegisterPageComponent, title: 'Register' },
    { path: 'placeholder', component: UnknownRouteComponent, title: 'Aur Naur!' },
    { path: '**', redirectTo: '/placeholder' },
];
