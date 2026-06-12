import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { GetUserDetailsAction } from '../../shared/action/account.action';
import { GetBadgesAction } from '../../shared/action/menu.action';
import { GetNotificationAction } from '../../shared/action/notification.action';
import { NavService } from '../../shared/services/nav.service';
import { UserService } from '../../tools/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private store = inject(Store);
  private router = inject(Router);
  private navService = inject(NavService);
  private platformId = inject<Object>(PLATFORM_ID);
  private userService = inject(UserService);

  canActivate(): Observable<boolean | UrlTree> | boolean | UrlTree {
    // SSR : laisser passer sans vérification
    if (!isPlatformBrowser(this.platformId)) return true;

    return this.checkAuthStatus().pipe(
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          this.initializeData();
          return of(true);
        }
        return of(this.router.createUrlTree(['/connexion'])); // ← fix URL
      }),
    );
  }

  canActivateChild(): Observable<boolean | UrlTree> | boolean | UrlTree {
    // SSR : laisser passer
    if (!isPlatformBrowser(this.platformId)) return true;

    return this.checkAuthStatus().pipe(
      switchMap(isAuthenticated => {
        if (isAuthenticated) return of(true);
        return of(this.router.createUrlTree(['/connexion'])); // ← bloque vraiment
      }),
    );
  }

  private checkAuthStatus(): Observable<boolean> {
    // Utiliser UserService (source de vérité) plutôt que le store NGXS
    const isLoggedIn = this.userService.isLoggedIn() && !this.userService.isTokenExpired();
    return of(isLoggedIn);
  }

  private initializeData(): void {
    this.navService.sidebarLoading = true;
    this.store.dispatch(new GetBadgesAction());
    this.store.dispatch(new GetNotificationAction());
    this.store.dispatch(new GetUserDetailsAction()).subscribe({
      complete: () => {
        this.navService.sidebarLoading = false;
      },
    });
  }
}
