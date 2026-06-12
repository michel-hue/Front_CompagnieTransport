import { Component, DOCUMENT, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';

import { NgbNavConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { TranslateService } from '@ngx-translate/core';
import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { LogoutAction } from './shared/action/auth.action';
//import { GetCountriesAction } from './shared/action/country.action';
//import { GetSettingOptionAction } from './shared/action/setting.action';
//import { GetStatesAction } from './shared/action/state.action';
import { IValues } from './shared/interface/setting.interface';
import { SettingState } from './shared/state/setting.state';
import { LocalStorageService } from './tools';

@Component({
  selector: 'app-root',
  imports: [RouterModule, LoadingBarRouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private actions = inject(Actions);
  private router = inject(Router);
  private titleService = inject(Title);
  private store = inject(Store);
  private translate = inject(TranslateService);
  private localStorageService = inject(LocalStorageService);

  setting$: Observable<IValues | null> =
    inject(Store).select(SettingState.setting);

  public favIcon: HTMLLinkElement | null =  null;

  constructor() {
    const config = inject(NgbNavConfig);
    const document = inject<Document>(DOCUMENT);

    // Configuration de la langue
    this.translate.use('fr');

    // Titre par défaut de l'application
    this.titleService.setTitle('Seller App - Administration');

    // ⚠️ Actions commentées car on utilise notre propre API maintenant
    // this.store.dispatch(new GetSettingOptionAction());
    // this.store.dispatch(new GetCountriesAction());
    // this.store.dispatch(new GetStatesAction());

    // Configuration du système de settings (désactivée temporairement)
    // this.setting$.subscribe(setting => {
    //   if (setting?.general?.admin_site_language_direction === 'rtl') {
    //     document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
    //     document.body.classList.add('rtl');
    //   } else {
    //     document.getElementsByTagName('html')[0].removeAttribute('dir');
    //     document.body.classList.remove('rtl');
    //   }
    //   this.favIcon = document.querySelector('#appIcon');
    //   this.favIcon!.href = <string>setting?.general?.favicon_image?.original_url;
    //   this.titleService.setTitle(
    //     setting?.general?.site_title && setting?.general?.site_tagline
    //       ? `${setting?.general?.site_title} | ${setting?.general?.site_tagline}`
    //       : 'Seller App - Administration',
    //   );
    // });

    // Configuration des navs Bootstrap
    config.destroyOnHide = false;
    config.roles = false;

    // Redirection vers connexion lors du logout
    this.actions.pipe(ofActionDispatched(LogoutAction)).subscribe(() => {
      // Nettoyer les données utilisateur du localStorage
      this.localStorageService.clearUserData();
      console.log('🚪 Déconnexion - Redirection vers la page de connexion');

      // Rediriger vers la page de connexion
      void this.router.navigate(['/connexion']);
    });
  }
}
