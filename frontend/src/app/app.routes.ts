import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { TeacherDashboardPageComponent } from './pages/teacher-dashboard-page/teacher-dashboard-page.component';
import { ClassesPageComponent } from './pages/classes-page/classes-page.component';
import { ClassComponent } from './components/class/class.component';
import { StudentDashboardPageComponent } from './pages/student-dashboard-page/student-dashboard-page.component';
import { UnknownRouteComponent } from './components/unknown-route/unknown-route.component';
import { UserTypeGuard } from './guards/usertype.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { UnauthorizedGuard } from './guards/unauthorized.guard';
import { AlreadyAuthenticatedComponent } from './components/already-authenticated/already-authenticated.component';
import { AssignmentsPageComponent } from './pages/assignments-page/assignments-page.component';
import { ExplorePageComponent } from './pages/explore-page/explore-page.component';
import { AuthorizedGuard } from './guards/authorized.guard';

/**
 * Routing of our frontend.
 * Based on https://angular.dev/guide/routing/common-router-tasks
 */
export const routes: Routes = [
    { path: '', component: LandingPageComponent, title: 'Landing Page', canActivate: [UnauthorizedGuard] },
    { path: 'teacher/dashboard', component: TeacherDashboardPageComponent, canActivate: [UserTypeGuard], data: { userType: 'teacher' } },
    { path: 'teacher/classes', component: ClassesPageComponent, title: "My Classes", canActivate: [UserTypeGuard], data: { userType: 'teacher' } },
    { path: 'teacher/classes/:id', component: ClassComponent, title: "Class", canActivate: [UserTypeGuard], data: { userType: 'teacher' } },
    { path: 'student/dashboard', component: StudentDashboardPageComponent, canActivate: [UserTypeGuard], data: { userType: 'student' } },
    { path: 'student/classes', component: ClassesPageComponent, title: "My Classes", canActivate: [UserTypeGuard], data: { userType: 'student' } },
    { path: 'student/classes/:id', component: ClassComponent, title: "Class", canActivate: [UserTypeGuard], data: { userType: 'student' } },
    { path: 'student/assignments', component: AssignmentsPageComponent, title: "My Assignments", canActivate: [UserTypeGuard], data: { userType: 'student' } },
    { path: 'teacher/assignments', component: AssignmentsPageComponent, title: "My Assignments", canActivate: [UserTypeGuard], data: { userType: 'teacher' } },
    { path: 'teacher/login', component: LoginPageComponent, title: 'Teacher Login', data: { isTeacher: true }, canActivate: [UnauthorizedGuard] },
    { path: 'student/login', component: LoginPageComponent, title: 'Student Login', data: { isTeacher: false }, canActivate: [UnauthorizedGuard] },
    { path: 'explore', component: ExplorePageComponent, title: 'Explore',canActivate: [AuthorizedGuard] },
    { path: 'register', component: RegisterPageComponent, title: 'Register', canActivate: [UnauthorizedGuard] },
    { path: 'placeholder', component: UnknownRouteComponent, title: 'Aur Naur', },
    { path: 'unauthorized', component: UnauthorizedComponent, title: 'Unauthorized' },
    { path: 'already-authenticated', component: AlreadyAuthenticatedComponent, title: 'Already Authenticated' },
    { path: '**', redirectTo: 'placeholder' },
];
