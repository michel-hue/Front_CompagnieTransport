import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

export interface CurrentUser {
  access_token: string;
  token: string;
  email: string;
  message?: string;
  status?: string;
  // Données du JWT décodées
  name?: string;
  phone?: string;
  role?: string;
  isSuperAdmin?: boolean;
  permissions?: string[]; // Tableau plat de codes de permissions
  // Données complètes du vendeur, de l'utilisateur et de la boutique depuis le JWT
  vendeur?: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    tel: string;
    adresse?: string;
    photo?: string;
    photourl?: string;
    social_provider?: string;
    social_token?: string;
    mode?: string;
    firebase_account?: any;
    createdAt?: string;
    updatedAt?: string;
  };
  user?: {
    id: string;
    user_id: string;
    role: number;
    is_active: number;
    token_firebase?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  boutique?: {
    id: string;
    libelle: string;
    logo?: string;
    logourl?: string;
    adresse?: string;
    vendeur_id: string;
    date_creation?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private localStorageService = inject(LocalStorageService);
  
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$: Observable<CurrentUser | null> = this.currentUserSubject.asObservable();

  constructor() {
    // Charger les données utilisateur au démarrage
    this.loadUserFromStorage();
  }

  /**
   * Charger les données utilisateur depuis le localStorage
   */
  loadUserFromStorage(): void {
    const userData = this.localStorageService.getJsonValue('user');
    if (userData && userData.token) {
      // Si les données vendeur et user sont déjà présentes (formatage depuis connexion/inscription)
      if (userData.vendeur || userData.user) {
        const user: CurrentUser = {
          ...userData,
          name: userData.name || (userData.vendeur ? `${userData.vendeur.prenom || ''} ${userData.vendeur.nom || ''}`.trim() : 'Utilisateur'),
          phone: userData.vendeur?.tel || userData.phone || '',
          role: userData.role || (userData.user?.role === 1 ? 'Vendeur' : 'Utilisateur'),
          permissions: userData.permissions || [],
          vendeur: userData.vendeur,
          user: userData.user,
          boutique: userData.boutique,
        };
        this.currentUserSubject.next(user);
        return;
      }
      
      // Sinon, décoder le JWT pour extraire les informations utilisateur (ancien format)
      const decodedToken = this.decodeJWT(userData.token);
      
      // Transformer les permissions du format { module, fonctionnalites[] }
      // en un tableau plat de codes de fonctionnalités
      const flatPermissions = this.flattenPermissions(decodedToken?.permissions || []);
      
      const user: CurrentUser = {
        ...userData,
        name: decodedToken?.vendeur ? `${decodedToken.vendeur.prenom || ''} ${decodedToken.vendeur.nom || ''}`.trim() : (decodedToken?.nomprenom || 'Utilisateur'),
        phone: decodedToken?.vendeur?.tel || decodedToken?.tel || '',
        role: decodedToken?.user?.role === 1 ? 'Vendeur' : (decodedToken?.isSuperAdmin ? 'Super Admin' : 'Admin'),
        isSuperAdmin: decodedToken?.isSuperAdmin || false,
        permissions: flatPermissions,
        vendeur: decodedToken?.vendeur,
        user: decodedToken?.user,
        boutique: decodedToken?.boutique,
      };
      
      this.currentUserSubject.next(user);
      //console.log('✅ Données utilisateur chargées:', user);
      //console.log('📋 Permissions aplaties:', flatPermissions);
    } else {
      this.currentUserSubject.next(null);
    }
  }

  /**
   * Aplatir les permissions du JWT en un tableau de codes
   * Format JWT: [{ module: "X", fonctionnalites: ["A", "B"] }]
   * Format retourné: ["A", "B"]
   */
  private flattenPermissions(permissions: any[]): string[] {
    if (!Array.isArray(permissions)) {
      return [];
    }

    const flattened: string[] = [];
    
    permissions.forEach(modulePermission => {
      if (modulePermission?.fonctionnalites && Array.isArray(modulePermission.fonctionnalites)) {
        flattened.push(...modulePermission.fonctionnalites);
      }
    });

    return flattened;
  }

  /**
   * Mettre à jour les données utilisateur
   */
  setUser(userData: any): void {
    this.localStorageService.setJsonValue('user', userData);
    this.loadUserFromStorage();
  }

  /**
   * Obtenir les données utilisateur actuelles
   */
  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Déconnecter l'utilisateur
   */
  logout(): void {
    this.localStorageService.clearUserData();
    this.currentUserSubject.next(null);
    //console.log('🚪 Utilisateur déconnecté');
  }

  /**
   * Décoder un JWT (sans vérification de signature)
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
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('❌ Erreur lors du décodage du JWT:', error);
      return null;
    }
  }

  /**
   * Vérifier si le token est expiré
   */
  isTokenExpired(): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.token) {
      return true;
    }

    const decodedToken = this.decodeJWT(user.token);
    if (!decodedToken || !decodedToken.exp) {
      return true;
    }

    const expirationDate = new Date(decodedToken.exp * 1000);
    const now = new Date();

    return now >= expirationDate;
  }

  /**
   * Obtenir la première lettre du nom pour l'avatar
   */
  getUserInitial(): string {
    const user = this.getCurrentUser();
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.vendeur?.prenom) {
      return user.vendeur.prenom.charAt(0).toUpperCase();
    }
    if (user?.vendeur?.nom) {
      return user.vendeur.nom.charAt(0).toUpperCase();
    }
    return 'U';
  }

  /**
   * Vérifier si l'utilisateur a une permission spécifique
   * @param permissionCode Code de la permission (ex: "LECTURE_DES_PRODUITS")
   */
  hasPermission(permissionCode: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.permissions) {
      return false;
    }

    // Super Admin a toutes les permissions
    if (user.isSuperAdmin) {
      return true;
    }

    // Vérifier dans les permissions aplaties
    return user.permissions.includes(permissionCode);
  }

  /**
   * Vérifier si l'utilisateur a AU MOINS UNE des permissions fournies
   * @param permissionCodes Tableau de codes de permissions
   */
  hasAnyPermission(permissionCodes: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.permissions) {
      return false;
    }

    // Super Admin a toutes les permissions
    if (user.isSuperAdmin) {
      return true;
    }

    return permissionCodes.some(code => user.permissions?.includes(code));
  }

  /**
   * Vérifier si l'utilisateur a TOUTES les permissions fournies
   * @param permissionCodes Tableau de codes de permissions
   */
  hasAllPermissions(permissionCodes: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.permissions) {
      return false;
    }

    // Super Admin a toutes les permissions
    if (user.isSuperAdmin) {
      return true;
    }

    return permissionCodes.every(code => user.permissions?.includes(code));
  }
}

