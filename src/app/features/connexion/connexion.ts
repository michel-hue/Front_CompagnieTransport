import { Component, inject, OnInit, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

//import { Alert } from '../../shared/components/ui/alert/alert';
import { AuthDataService } from './data-access';
import { LocalStorageService, UserService } from '../../tools';
import { ChangePasswordModalComponent } from './modals/change-password-modal/change-password-modal';
import { ForgotPasswordModalComponent } from './modals/forgot-password-modal/forgot-password-modal';
//import { FirebaseAuthService } from '../../shared/services/firebase-auth.service';
//import { SocialProviderKey } from '../../shared/services/firebase-auth.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.html',
  styleUrls: ['./connexion.scss'],
  imports: [ReactiveFormsModule, RouterModule, TranslateModule, ChangePasswordModalComponent, ForgotPasswordModalComponent],
})
export class Connexion implements OnInit {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private localStorageService = inject(LocalStorageService);
  private userService = inject(UserService);
  //private firebaseAuth = inject(FirebaseAuthService);
  private authDataService = inject(AuthDataService);

  readonly changePasswordModal = viewChild<ChangePasswordModalComponent>('changePasswordModal');
  readonly forgotPasswordModal = viewChild<ForgotPasswordModalComponent>('forgotPasswordModal');

  public form: FormGroup;
  public isLoading = false;
  public errorMessage = '';
  public showPassword = false;
  public socialLoading = false;
  public socialError = '';

  //public lastProviderAttempt: SocialProviderKey | null = null;

  constructor() {
    this.form = this.formBuilder.group({
      email: new FormControl('admin', [Validators.required]),
      password: new FormControl('123456', [Validators.required]),
    });
  }

  ngOnInit(): void {
    // Vider le localStorage UNIQUEMENT si on n'a pas de token valide
    const user = this.localStorageService.getJsonValue('user');

    // Si pas de token ou token expiré, vider le localStorage
    if (!user || !user.token) {
      this.localStorageService.clear();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Ouvrir le modal de mot de passe oublié
   */
  async openForgotPasswordModal(): Promise<void> {
    await this.forgotPasswordModal()?.openModal();
  }

  /**
   * Décode un JWT (sans vérification de signature)
   * Retourne le payload décodé
   */
  private decodeJWT(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('❌ Format JWT invalide');
        return null;
      }

      // Décoder la partie payload (partie 2)
      const payload = parts[1];
      // Ajouter le padding si nécessaire pour base64
      const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);
      const decoded = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('❌ Erreur lors du décodage du JWT:', error);
      return null;
    }
  }

  // Méthode pour vérifier si le bouton doit être désactivé
  isButtonDisabled(): boolean {
    return this.isLoading || this.form.invalid;
  }

  // Méthode pour obtenir le message d'aide
  getHelpMessage(): string {
    if (this.form.invalid && this.form.touched) {
      const emailError = this.form.get('email')?.errors;
      const passwordError = this.form.get('password')?.errors;

      if (emailError?.['required'] && passwordError?.['required']) {
        return 'Veuillez saisir votre nom d\'utilisateur et votre mot de passe';
      } else if (emailError?.['required']) {
        return 'Veuillez saisir votre nom d\'utilisateur';
      } else if (passwordError?.['required']) {
        return 'Veuillez saisir votre mot de passe';
      }
    }
    return '';
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    await this.router.navigateByUrl('/tableau-de-bord');
  }
}

/*

  async connectWithProvider(provider: SocialProviderKey) {
    this.socialError = '';
    this.lastProviderAttempt = provider;
    this.socialLoading = true;
    try {
   /!*   const result = await this.firebaseAuth.signInWithProvider(provider);
      const token = result.idToken || result.accessToken;
      if (!token) {
        throw new Error('Impossible de récupérer le token Firebase.');
      }
      const userData = {
        access_token: token,
        token,
        email: result.email || '',
        message: 'Connexion réussie',
        status: 'success',
        name: result.displayName || (result.email || 'Utilisateur'),
        permissions: [] as string[],
      };
      this.localStorageService.setJsonValue('user', userData);
      this.userService.setUser(userData);*!/
      try {
      /!*  const verifyResponse = await this.authDataService.verifyFirebaseLogin(userData.email, token);
        if (verifyResponse?.data?.token) {
          // Décoder le JWT retourné par l'API
          const decoded = this.decodeJWT(verifyResponse.data.token);
          if (decoded) {
            // Formater les données pour userService
            const formattedUserData = {
              token: verifyResponse.data.token,
              access_token: verifyResponse.data.token,
              email: decoded.vendeur?.email || userData.email,
              name: `${decoded.vendeur?.prenom || ''} ${decoded.vendeur?.nom || ''}`.trim() || userData.name,
              role: decoded.user?.role === 1 ? 'Vendeur' : 'Utilisateur',
              permissions: [] as string[],
              vendeur: decoded.vendeur,
              user: decoded.user,
              boutique: decoded.boutique,
            };
            this.localStorageService.setJsonValue('user', formattedUserData);
            this.userService.setUser(formattedUserData);
          }
        }*!/
      } catch (verifyErr: any) {
       // this.socialError = verifyErr?.message || 'Vérification serveur échouée.';
        return;
      }
     // await this.router.navigateByUrl('/tableau-de-bord');
    } catch (e: any) {
    //  this.socialError = e?.message || 'Erreur lors de la connexion sociale.';
    } finally {
     // this.socialLoading = false;
    }
  }
*/


