import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

/*import {
  FirebaseAuthService,
  FirebaseEmailRegistrationResult,
  SocialProviderKey,
} from '../../shared/services/firebase-auth.service';*/
import { InscriptionDataService } from './data-access/inscription-data.service';
import { AuthDataService } from '../connexion/data-access/auth-data.service';
import { finalize } from 'rxjs/operators';
import { UserService, LocalStorageService } from '../../tools';

interface FirebaseAccountMeta {
  uid: string;
  email: string | null;
  display_name: string | null;
  photo_url: string | null;
  email_verified: boolean;
  provider: string;
  access_token: string | null;
  id_token: string | null;
}
@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.html',
  styleUrls: ['./inscription.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class Inscription {
  private fb = inject(FormBuilder);
  //private firebaseAuth = inject(FirebaseAuthService);
  private inscriptionDataService = inject(InscriptionDataService);
  private authDataService = inject(AuthDataService);
  private userService = inject(UserService);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);
  private photoObjectUrl: string | null = null;
  private firebaseAccountMeta: FirebaseAccountMeta | null = null;

  public steps: { title: string; description: string }[] = [
    {
      title: 'Étape 1',
      description: 'Renseignez vos informations de contact pour générer un accès sécurisé.',
    },
    {
      title: 'Étape 2',
      description: 'Ajoutez les informations essentielles pour démarrer sur Seller App.',
    },
    {
      title: 'Étape 3',
      description: 'Notre équipe vérifie vos données et active votre profil marchand.',
    },
  ];

  public currentStep = 0;
  //public readonly socialProviders: SocialProviderKey[] = ['Google', 'Facebook', 'TikTok'];
  public socialAuthLoading = false;
  public socialAuthError = '';
  //public lastProviderAttempt: SocialProviderKey | null = null;
  public submitLoading = false;
  public submitError = '';
  public submitSuccess = false;

  public confirmForm: FormGroup = this.fb.group({
    acceptTerms: [false, Validators.requiredTrue],
  });
  public accountForm: FormGroup = this.fb.group({
    mode: ['email'],
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    tel: [''],
    adresse: [''],
    photoFile: [null],
    socialProvider: [''],
    socialToken: [''],
  });

  public storeForm: FormGroup = this.fb.group({
    label: ['', Validators.required],
    logoFile: [null],
    hasPhysicalStore: [false],
    location: [''],
  });

  constructor() {
    this.storeForm
      .get('hasPhysicalStore')
      ?.valueChanges.subscribe((value: boolean) => {
        const locationControl = this.storeForm.get('location');
        if (value) {
          locationControl?.setValidators([Validators.required]);
        } else {
          locationControl?.clearValidators();
          locationControl?.reset('');
        }
        locationControl?.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.revokePhotoPreview();
  }

  get isEmailMode(): boolean {
    return this.accountForm.get('mode')?.value === 'email';
  }

  public selectMode(mode: 'email' | 'social'): void {
    if (this.accountForm.get('mode')?.value === mode) {
      return;
    }

    this.accountForm.patchValue({ mode });

    const nomControl = this.accountForm.get('nom');
    const prenomControl = this.accountForm.get('prenom');
    const emailControl = this.accountForm.get('email');
    const passwordControl = this.accountForm.get('password');
    const socialProviderControl = this.accountForm.get('socialProvider');

    if (mode === 'email') {
      nomControl?.setValidators([Validators.required]);
      prenomControl?.setValidators([Validators.required]);
      emailControl?.setValidators([Validators.required, Validators.email]);
      passwordControl?.setValidators([Validators.required, Validators.minLength(8)]);
      socialProviderControl?.clearValidators();
      socialProviderControl?.reset('');
      this.accountForm.get('socialToken')?.reset('');
    } else {
      nomControl?.clearValidators();
      prenomControl?.clearValidators();
      emailControl?.clearValidators();
      passwordControl?.clearValidators();
      socialProviderControl?.setValidators([Validators.required]);
    }

    nomControl?.updateValueAndValidity();
    prenomControl?.updateValueAndValidity();
    emailControl?.updateValueAndValidity();
    passwordControl?.updateValueAndValidity();
    socialProviderControl?.updateValueAndValidity();
  }
/*

  public async connectWithProvider(provider: SocialProviderKey): Promise<void> {
    this.selectMode('social');
    this.accountForm.patchValue({ socialProvider: provider });
    this.accountForm.get('socialProvider')?.markAsTouched();
    this.socialAuthError = '';
    this.socialAuthLoading = true;
    this.lastProviderAttempt = provider;

    try {
      const result = await this.firebaseAuth.signInWithProvider(provider);
      const token = result.accessToken ?? result.idToken ?? '';

      if (!token) {
        throw new Error("Impossible de récupérer le token d'authentification.");
      }

      const [firstName = '', ...lastNameParts] = (result.displayName ?? '').split(' ').filter(Boolean);

      this.firebaseAccountMeta = {
        uid: result.uid,
        email: result.email,
        display_name: result.displayName,
        photo_url: null,
        email_verified: result.emailVerified ?? true,
        provider: provider,
        access_token: result.accessToken,
        id_token: result.idToken,
      };

      this.accountForm.patchValue({
        socialProvider: provider,
        socialToken: token,
        prenom: firstName || this.accountForm.get('prenom')?.value,
        nom: lastNameParts.join(' ') || this.accountForm.get('nom')?.value,
        email: result.email ?? this.accountForm.get('email')?.value,
      });

      this.accountForm.get('socialProvider')?.setErrors(null);
      this.accountForm.get('socialToken')?.setErrors(null);
    } catch (error: any) {
      console.error('Erreur de connexion sociale', error);
      this.socialAuthError = error?.message ?? "Une erreur est survenue pendant l'authentification.";
      this.accountForm.patchValue({ socialToken: '' });
      this.accountForm.get('socialProvider')?.setErrors({ required: true });
    } finally {
      this.socialAuthLoading = false;
    }
  }
*/

  public goToStep(step: number): void {
    if (step < 0 || step > this.steps.length - 1) {
      return;
    }

    if (step === 1 && !this.validateAccountStep()) {
      return;
    }

    this.currentStep = step;
  }

  public nextStep(): void {
    if (this.currentStep === 0 && !this.validateAccountStep()) {
      return;
    }
    this.currentStep = Math.min(this.currentStep + 1, this.steps.length - 1);
  }

  public previousStep(): void {
    this.currentStep = Math.max(this.currentStep - 1, 0);
  }

  private validateAccountStep(): boolean {
    this.accountForm.markAllAsTouched();
    const mode = this.accountForm.get('mode')?.value;
    if (mode === 'social' && !this.accountForm.get('socialToken')?.value) {
      this.accountForm.get('socialProvider')?.setErrors({ required: true });
      return false;
    }
    return this.accountForm.valid;
  }

  public async submit(): Promise<void> {
    this.confirmForm.markAllAsTouched();
    this.storeForm.markAllAsTouched();
    if (!this.storeForm.valid || !this.accountForm.valid || !this.confirmForm.valid) {
      if (this.storeForm.get('logoFile')?.errors?.['invalidFile']) {
        this.storeForm.get('logoFile')?.markAsTouched();
      }
      return;
    }

    try {
      if (this.isEmailMode) {
      /*  const registration = await this.firebaseAuth.registerWithEmail(
          this.accountForm.get('email')?.value,
          this.accountForm.get('password')?.value,
          `${this.accountForm.get('prenom')?.value} ${this.accountForm.get('nom')?.value}`.trim(),
        );
        this.firebaseAccountMeta = this.buildFirebaseMetaFromEmail(registration);*/

      } else if (!this.firebaseAccountMeta) {
        this.submitError = 'Veuillez finaliser la connexion via votre réseau social.';
        return;
      }
    } catch (error: any) {
      this.submitError = error?.message ?? 'Création du compte Firebase impossible.';
      return;
    }

    const formData = new FormData();
    const accountPayload = this.getAccountPayload();
    const storePayload = this.getStorePayload();

    formData.append('account', JSON.stringify(accountPayload));
    formData.append('store', JSON.stringify(storePayload));
    formData.append('firebaseAccount', JSON.stringify(this.firebaseAccountMeta));

    const photoFile = this.accountForm.get('photoFile')?.value;
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    const logo = this.storeForm.get('logoFile')?.value;
    if (logo) {
      formData.append('logo', logo);
    }

    this.submitLoading = true;
    this.submitError = '';
    this.submitSuccess = false;

    this.inscriptionDataService
      .registerVendor(formData)
      .pipe(finalize(() => (this.submitLoading = false)))
      .subscribe({
        next: async response => {
          this.submitSuccess = true;
          // Après inscription réussie, vérifier la connexion pour obtenir le JWT avec toutes les infos
          const idToken = this.firebaseAccountMeta?.id_token || this.firebaseAccountMeta?.access_token || '';
          const email = this.firebaseAccountMeta?.email || this.accountForm.get('email')?.value || '';

          if (idToken && email) {
            try {
              const verifyResponse = await this.authDataService.verifyFirebaseLogin(email, idToken);
              if (verifyResponse?.data?.token) {
                // Décoder le JWT retourné par l'API
                const decoded = this.decodeJWT(verifyResponse.data.token);
                if (decoded) {
                  // Formater les données pour userService
                  const formattedUserData = {
                    token: verifyResponse.data.token,
                    access_token: verifyResponse.data.token,
                    email: decoded.vendeur?.email || email,
                    name: `${decoded.vendeur?.prenom || ''} ${decoded.vendeur?.nom || ''}`.trim() || 'Utilisateur',
                    role: decoded.user?.role === 1 ? 'Vendeur' : 'Utilisateur',
                    permissions: [] as string[],
                    vendeur: decoded.vendeur,
                    user: decoded.user,
                    boutique: decoded.boutique,
                  };
                  this.localStorageService.setJsonValue('user', formattedUserData);
                  this.userService.setUser(formattedUserData);
                  // Rediriger vers le tableau de bord
                  await this.router.navigateByUrl('/tableau-de-bord');
                  return;
                }
              }
            } catch (verifyErr: any) {
              console.error('Erreur lors de la vérification après inscription:', verifyErr);
              this.submitError = verifyErr?.message || 'Erreur lors de la connexion automatique.';
            }
          }
          // Fallback si pas de token ou erreur
          const displayName =
            this.firebaseAccountMeta?.display_name ||
            `${this.accountForm.get('prenom')?.value || ''} ${this.accountForm.get('nom')?.value || ''}`.trim();
          const userPayload = {
            token: idToken,
            access_token: idToken,
            email,
            name: displayName || 'Utilisateur',
            role: 'Vendeur',
            permissions: [] as string[],
          };
          if (idToken) {
            this.localStorageService.setJsonValue('user', userPayload);
            this.userService.setUser(userPayload);
          }
          await this.router.navigateByUrl('/tableau-de-bord');
        },
        error: err => {
          this.submitError = err?.message ?? 'Une erreur est survenue lors de votre inscription.';
          console.error('❌ Erreur inscription vendeur', err);
        },
      });
  }

  public handleLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.storeForm.patchValue({ logoFile: null });
      return;
    }

    const file = input.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5 Mo

    if (!allowedTypes.includes(file.type) || file.size > maxSize) {
      this.storeForm.get('logoFile')?.setErrors({
        invalidFile: true,
        reason: !allowedTypes.includes(file.type) ? 'type' : 'size',
      });
      this.storeForm.patchValue({ logoFile: null });
      return;
    }

    this.storeForm.get('logoFile')?.setErrors(null);
    this.storeForm.patchValue({ logoFile: file });
  }

  public handlePhotoFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.revokePhotoPreview();
      this.accountForm.patchValue({ photoFile: null });
      return;
    }

    const file = input.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type) || file.size > maxSize) {
      this.accountForm.get('photoFile')?.setErrors({
        invalidFile: true,
        reason: !allowedTypes.includes(file.type) ? 'type' : 'size',
      });
      this.revokePhotoPreview();
      this.accountForm.patchValue({ photoFile: null });
      return;
    }

    this.accountForm.get('photoFile')?.setErrors(null);
    this.accountForm.patchValue({ photoFile: file });
    this.revokePhotoPreview();
    this.photoObjectUrl = URL.createObjectURL(file);
  }

  public get photoPreviewUrl(): string | null {
    return this.photoObjectUrl;
  }

  private revokePhotoPreview(): void {
    if (this.photoObjectUrl) {
      URL.revokeObjectURL(this.photoObjectUrl);
      this.photoObjectUrl = null;
    }
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

  private getAccountPayload() {
    const { photoFile, ...rest } = this.accountForm.value;
    return rest;
  }

  private getStorePayload() {
    const { logoFile, ...rest } = this.storeForm.value;
    return rest;
  }

  /*private buildFirebaseMetaFromEmail(
    registration: FirebaseEmailRegistrationResult,
  ): FirebaseAccountMeta {
    return {
      uid: registration.uid,
      email: registration.email,
      display_name: registration.displayName,
      photo_url: null,
      email_verified: registration.emailVerified,
      provider: 'password',
      access_token: null,
      id_token: registration.idToken,
    };
  }*/
}
