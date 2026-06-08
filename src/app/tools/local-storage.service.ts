import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  /**
   * Définir une valeur JSON dans le localStorage
   */
  setJsonValue(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans localStorage:', error);
    }
  }

  /**
   * Récupérer une valeur JSON du localStorage
   */
  getJsonValue(key: string): any {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Erreur lors de la lecture du localStorage:', error);
      return null;
    }
  }

  /**
   * Définir une valeur string dans le localStorage
   */
  setValue(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans localStorage:', error);
    }
  }

  /**
   * Récupérer une valeur string du localStorage
   */
  getValue(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Erreur lors de la lecture du localStorage:', error);
      return null;
    }
  }

  /**
   * Supprimer une clé du localStorage
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erreur lors de la suppression du localStorage:', error);
    }
  }

  /**
   * Effacer tout le localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erreur lors du nettoyage du localStorage:', error);
    }
  }

  /**
   * Effacer uniquement les données utilisateur (pour la déconnexion)
   */
  clearUserData(): void {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
    } catch (error) {
      console.error('Erreur lors de la suppression des données utilisateur:', error);
    }
  }

  /**
   * Vérifier si une clé existe
   */
  hasKey(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Vérifier si un utilisateur est connecté
   */
  isUserLoggedIn(): boolean {
    return this.hasKey('user') && this.getJsonValue('user')?.token !== null;
  }
}

