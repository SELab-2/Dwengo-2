import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ClassesPageComponent } from './pages/classes-page/classes-page.component';
import { ClassComponent } from './components/class/class.component';
import { UnknownRouteComponent } from './components/unknown-route/unknown-route.component';

/**
 * Routing of our frontend.
 * Based on https://angular.dev/guide/routing/common-router-tasks
 */
export const routes: Routes = [
    { path: '', component: LandingPageComponent, title: 'Landing Page' },
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent },
    { path: 'teacher/classes', component: ClassesPageComponent },
    { path: 'teacher/classes/:id', component: ClassComponent },
    { path: 'student/classes', component: ClassesPageComponent },
    { path: 'student/classes/:id', component: ClassComponent },
    { path: 'teacher-login', component: LoginPageComponent, title: 'Teacher Login', data: { isTeacher: true } },
    { path: 'student-login', component: LoginPageComponent, title: 'Student Login', data: { isTeacher: false } },
    { path: 'register', component: RegisterPageComponent, title: 'Register' },
    { path: 'placeholder', component: UnknownRouteComponent, title: 'Aur Naur!' },
    { path: '**', redirectTo: '/placeholder' },
];
