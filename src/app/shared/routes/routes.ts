import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'tableau-de-bord',
    loadComponent: () => import('../../features/tableau-de-bord/tableau-de-bord').then(m => m.TableauDeBord),
  },
  {
    path: 'parametres',
    loadChildren: () => import('../../features/parametres/parametres.routes'),
  },
];
