import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, OnInit } from '@angular/core';
import {
  NgbNav,
  NgbNavContent,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLink,
  NgbNavLinkBase,
  NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

//import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { CategoriesComponent } from './components/categories/categories';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.html',
  styleUrls: ['./parametres.scss'],
  imports: [
   // PageWrapper,
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLink,
    NgbNavLinkBase,
    NgbNavContent,
    NgbNavOutlet,
    CommonModule,
    TranslateModule,
    CategoriesComponent,
  ],
})
export class Parametres implements OnInit {
  private platformId = inject(PLATFORM_ID);

  public active = 'categories'; // Premier onglet actif par défaut
  public isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Le premier onglet sera chargé automatiquement car active = 'categories'
  }

  /**
   * Gérer le changement d'onglet
   */
  onTabChange(tabId: string): void {
    this.active = tabId;
  }
}
