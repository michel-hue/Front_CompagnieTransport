import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiService } from '../../../tools/api.service';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  data: {
    token: string;
    status: string;
    statusCode: number;
    message: string;
    firstConnection?: boolean;
  };
  meta: {
    timestamp: string;
  };
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthDataService {
  private api = inject(ApiService);

  /**
   * Authentification utilisateur système
   * @param username - Numéro de téléphone (ex: +33123456789)
   * @param password - Mot de passe
   */
  userAuthentication = async (username: string, password: string): Promise<LoginResponse> => {
    const data: LoginCredentials = {
      username: username,
      password: password,
    };
    return await lastValueFrom(this.api.postWithParams<LoginResponse>('auth/login', data));
  };

  /**
   * Demande de réinitialisation du mot de passe
   * @param email - Email de l'utilisateur
   */
  forgotPassword = async (email: string): Promise<any> => {
    const data = { email };
    return await lastValueFrom(this.api.postWithParams('auth/forgot-password', data));
  };

  /**
   * Réinitialiser le mot de passe
   * @param token - Token de réinitialisation
   * @param newPassword - Nouveau mot de passe
   */
  resetPassword = async (token: string, newPassword: string): Promise<any> => {
    const data: ResetPasswordData = {
      token,
      newPassword,
    };
    return await lastValueFrom(this.api.postWithParams('auth/reset-password', data));
  };

  /**
   * Changer le mot de passe lors de la première connexion
   * @param username - Nom d'utilisateur
   * @param newPassword - Nouveau mot de passe
   * @param confirmPassword - Confirmation du mot de passe
   */
  changeFirstPassword = async (username: string, newPassword: string, confirmPassword: string): Promise<LoginResponse> => {
    const data = {
      username,
      newPassword,
      confirmPassword,
    };
    return await lastValueFrom(this.api.postWithParams<LoginResponse>('auth/change-first-password', data));
  };

  /**
   * Vérifier la connexion Firebase côté API (email + token)
   */
  verifyFirebaseLogin = async (email: string, token: string): Promise<any> => {
    const data = { email, token };
    return await lastValueFrom(this.api.postWithParams('public/vendors/verify-login', data));
  };
}

