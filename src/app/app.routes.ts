import { Routes } from '@angular/router';

import { AuthGuard } from './core/guard/auth.guard';
import { full } from './shared/routes/full';
import { content } from './shared/routes/routes';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'connexion',
    pathMatch: 'full',
  },
  {
    path: 'connexion',
    loadComponent: () => import('./features/connexion/connexion').then(m => m.Connexion),
  },
  {
    path: 'inscription',
    loadComponent: () => import('./features/inscription/inscription').then(m => m.Inscription),
  },
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.routes'),
    //canActivateChild: [AuthGuard],
  },
  {
    path: '',
   // canActivate: [AuthGuard],
    loadComponent: () => import('./shared/components/layout/content/content').then(m => m.Content),
    children: content,
  },
  {
    path: '',
   // canActivate: [AuthGuard],
    loadComponent: () => import('./shared/components/layout/full/full').then(m => m.Full),
    children: full,
  },
  {
    path: '**',
    //canActivate: [AuthGuard],
    pathMatch: 'full',
    loadComponent: () => import('./errors/error404/error404').then(m => m.Error404),
  },
];
