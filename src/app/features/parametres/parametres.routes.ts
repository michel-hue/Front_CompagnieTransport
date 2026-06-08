import { Routes } from '@angular/router';

import { Parametres } from './parametres';
import { CategoriesComponent } from './components/categories/categories';
export default [
  {
    path: '',
    component: Parametres,
  },
  {
    path: 'categories',
    component: CategoriesComponent,
  }
] as Routes;
