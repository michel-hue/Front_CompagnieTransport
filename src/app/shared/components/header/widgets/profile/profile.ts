import { CommonModule } from '@angular/common';
import { Component, inject, viewChild, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { LogoutAction } from '../../.././../../shared/action/auth.action';
import { IAccountUser } from '../../.././../../shared/interface/account.interface';
import { AccountState } from '../../.././../../shared/state/account.state';
import { UserService, CurrentUser } from '../../../../../tools';
import { ConfirmationModal } from '../../../ui/modal/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
  imports: [RouterModule, ConfirmationModal, CommonModule, TranslateModule],
})
export class Profile implements OnInit {
  private store = inject(Store);
  private userService = inject(UserService);

  user$: Observable<IAccountUser> = inject(Store).select(AccountState.user);
  currentUser$: Observable<CurrentUser | null> = this.userService.currentUser$;

  readonly ConfirmationModal = viewChild<ConfirmationModal>('confirmationModal');

  public active: boolean = false;
  public currentUser: CurrentUser | null = null;

  ngOnInit(): void {
    // Charger les données utilisateur depuis le localStorage
    this.userService.loadUserFromStorage();
    
    // S'abonner aux changements
    this.currentUser$.subscribe(user => {
      this.currentUser = user;
      //console.log('👤 Utilisateur actuel:', user);
    });
  }

  clickHeaderOnMobile() {
    this.active = !this.active;
  }

  logout() {
    this.store.dispatch(new LogoutAction());
  }

  getUserInitial(): string {
    return this.userService.getUserInitial();
  }

  /**
   * Tronquer le nom de l'utilisateur s'il dépasse 12 caractères
   */
  getTruncatedName(name: string | undefined): string {
    if (!name) return 'Utilisateur';
    if (name.length > 12) {
      return name.substring(0, 12) + '...';
    }
    return name;
  }
}
