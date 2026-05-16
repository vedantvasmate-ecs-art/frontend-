import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/landing/landing/landing.component').then(m => m.LandingComponent) },

  // Auth (public)
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },

  // Dashboard (authenticated)
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },

  // Projects
  {
    path: 'projects',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./features/projects/project-list/project-list.component').then(m => m.ProjectListComponent) },
      { path: 'new', loadComponent: () => import('./features/projects/project-form/project-form.component').then(m => m.ProjectFormComponent), canActivate: [adminGuard] },
      { path: ':id', loadComponent: () => import('./features/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent) },
      { path: ':id/edit', loadComponent: () => import('./features/projects/project-form/project-form.component').then(m => m.ProjectFormComponent), canActivate: [adminGuard] },
      { path: ':projectId/tasks/new', loadComponent: () => import('./features/tasks/task-form/task-form.component').then(m => m.TaskFormComponent) },
      { path: ':projectId/tasks/:taskId/edit', loadComponent: () => import('./features/tasks/task-form/task-form.component').then(m => m.TaskFormComponent) },
    ]
  },

  // Tasks
  {
    path: 'tasks/:id',
    loadComponent: () => import('./features/tasks/task-detail/task-detail.component').then(m => m.TaskDetailComponent),
    canActivate: [authGuard]
  },

  // Fallback
  { path: '**', redirectTo: '/dashboard' }
];
