/*import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firebaseWebConfig } from '../config/firebase.config';


import {
  Auth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';

export type SocialProviderKey = 'Google' | 'Facebook' | 'TikTok';

export interface FirebaseAuthResult {
  provider: SocialProviderKey;
  uid: string;
  displayName: string | null;
  email: string | null;
  photoUrl: string | null;
  emailVerified: boolean;
  accessToken: string | null;
  idToken: string | null;
  rawCredential?: string | null;
}

export interface FirebaseEmailRegistrationResult {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
  emailVerified: boolean;
  idToken: string | null;
}

export interface FirebaseEmailLoginResult {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  idToken: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  private firebaseApp: FirebaseApp | undefined;
  private auth: Auth | undefined;
  private platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    if (this.isBrowser) {
      this.firebaseApp = this.initApp();
      this.auth = getAuth(this.firebaseApp);
    }
  }

  async signInWithProvider(providerKey: SocialProviderKey): Promise<FirebaseAuthResult> {
    if (!this.isBrowser || !this.auth) {
      throw new Error("L'authentification Firebase est uniquement disponible dans le navigateur.");
    }

    const provider = this.buildProvider(providerKey);
    const result = await signInWithPopup(this.auth, provider);
    const { accessToken, idToken, rawCredential } = this.extractCredential(providerKey, result);

    return {
      provider: providerKey,
      uid: result.user.uid,
      displayName: result.user.displayName,
      email: result.user.email,
      photoUrl: result.user.photoURL,
      emailVerified: result.user.emailVerified,
      accessToken,
      idToken,
      rawCredential,
    };
  }

  async registerWithEmail(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<FirebaseEmailRegistrationResult> {
    if (!this.isBrowser || !this.auth) {
      throw new Error("L'authentification Firebase est uniquement disponible dans le navigateur.");
    }

    const credential = await createUserWithEmailAndPassword(this.auth, email, password);

    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }

    const idToken = await credential.user.getIdToken(true);

    return {
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: credential.user.displayName,
      photoUrl: credential.user.photoURL,
      emailVerified: credential.user.emailVerified,
      idToken,
    };
  }

  async loginWithEmail(email: string, password: string): Promise<FirebaseEmailLoginResult> {
    if (!this.isBrowser || !this.auth) {
      throw new Error("L'authentification Firebase est uniquement disponible dans le navigateur.");
    }
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    const idToken = await credential.user.getIdToken(true);
    return {
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: credential.user.displayName,
      emailVerified: credential.user.emailVerified,
      idToken,
    };
  }


  async sendPasswordResetEmail(email: string): Promise<void> {
    if (!this.isBrowser || !this.auth) {
      throw new Error("L'authentification Firebase est uniquement disponible dans le navigateur.");
    }
    await sendPasswordResetEmail(this.auth, email);
  }

  private initApp(): FirebaseApp {
    if (!getApps().length) {
      return initializeApp(firebaseWebConfig);
    }

    return getApps()[0];
  }

  private buildProvider(providerKey: SocialProviderKey) {
    switch (providerKey) {
      case 'Google':
        return new GoogleAuthProvider();
      case 'Facebook':
        const facebook = new FacebookAuthProvider();
        facebook.addScope('email');
        facebook.addScope('public_profile');
        return facebook;
      case 'TikTok':
      default:
        return new OAuthProvider('tiktok.com');
    }
  }

  private extractCredential(providerKey: SocialProviderKey, result: UserCredential) {
    switch (providerKey) {
      case 'Google': {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        return {
          accessToken: credential?.accessToken ?? null,
          idToken: credential?.idToken ?? null,
          rawCredential: credential?.toJSON ? JSON.stringify(credential.toJSON()) : null,
        };
      }
      case 'Facebook': {
        const credential = FacebookAuthProvider.credentialFromResult(result);
        return {
          accessToken: credential?.accessToken ?? null,
          idToken: credential?.idToken ?? null,
          rawCredential: credential ? JSON.stringify(credential) : null,
        };
      }
      case 'TikTok':
      default: {
        const credential = OAuthProvider.credentialFromResult(result);
        return {
          accessToken: (credential as any)?.accessToken ?? null,
          idToken: credential?.idToken ?? null,
          rawCredential: credential ? JSON.stringify(credential) : null,
        };
      }
    }
  }
}
*/
