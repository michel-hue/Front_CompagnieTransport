import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { ClickOutsideDirective } from '../../../../directive/out-side-directive';
import { Button } from '../../../ui/button/button';

export interface ILanguage {
  language: string;
  code: string;
  icon: string;
}

@Component({
  selector: 'app-languages',
  templateUrl: './languages.html',
  styleUrls: ['./languages.scss'],
  imports: [ClickOutsideDirective, Button],
})
export class Languages {
  private translate = inject(TranslateService);
  private platformId = inject<Object>(PLATFORM_ID);

  public active: boolean = false;
  public languages: ILanguage[] = [
    {
      language: 'English',
      code: 'en',
      icon: 'us',
    },
    {
      language: 'Français',
      code: 'fr',
      icon: 'fr',
    },
  ];

  public selectedLanguage: ILanguage = {
    language: 'Français',
    code: 'fr',
    icon: 'fr',
  };

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      let language = localStorage.getItem('language');

      if (language == null) {
        // Langue par défaut : Français
        this.selectedLanguage = {
          language: 'Français',
          code: 'fr',
          icon: 'fr',
        };
        this.translate.use('fr');
        localStorage.setItem('language', JSON.stringify(this.selectedLanguage));
        //console.log('🌍 Langue par défaut : Français');
      } else {
        this.selectedLanguage = JSON.parse(language);
        this.translate.use(this.selectedLanguage.code);
        //console.log('🌍 Langue chargée :', this.selectedLanguage.language);
      }
    }
  }

  selectLanguage(language: ILanguage) {
    this.active = false;
    this.translate.use(language.code);
    this.selectedLanguage = language;
    localStorage.setItem('language', JSON.stringify(this.selectedLanguage));
    console.log('🌍 Langue changée :', this.selectedLanguage.language);
  }

  clickHeaderOnMobile() {
    this.active = !this.active;
  }

  hideDropdown() {
    this.active = false;
  }
}
