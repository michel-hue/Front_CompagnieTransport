import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../../tools/local-storage.service';
import { UserService } from '../../tools/user.service';
import { Router } from '@angular/router';

/**
 * Intercepteur HTTP pour ajouter automatiquement le token JWT
 * à toutes les requêtes sauf celle de connexion
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const localStorageService = inject(LocalStorageService);
  const userService = inject(UserService);
  const router = inject(Router);

  // URLs qui ne nécessitent pas de token
  const publicUrls = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/public/vendors/register', // inscription vendeur (publique)
  ];
  
  // Vérifier si c'est une URL publique
  const isPublicUrl = publicUrls.some(url => req.url.includes(url));

  // Si c'est une URL publique, passer la requête sans modification
  if (isPublicUrl) {
    console.log('🌐 Requête publique (pas de token) :', req.url);
    return next(req);
  }

  // Vérifier si le token est expiré (ne pas rediriger pour les URLs publiques)
  if (userService.isTokenExpired() && !isPublicUrl) {
    console.log('⚠️ Token expiré, redirection vers /connexion');
    userService.logout();
    router.navigateByUrl('/connexion');
    // On laisse passer la requête pour éviter de bloquer l'application
    return next(req);
  }

  // Récupérer le token depuis le localStorage
  const userData = localStorageService.getJsonValue('user');
  const token = userData?.['access_token'] || userData?.['token'];

  // Si un token existe, l'ajouter aux headers
  if (token) {
    // Ne pas forcer Content-Type pour FormData (le navigateur le définit automatiquement avec le boundary)
    const headers: any = {
      Authorization: `Bearer ${token}`,
    };
    
    // Ajouter Content-Type uniquement si ce n'est pas déjà défini et si ce n'est pas du FormData
    if (!req.headers.has('Content-Type') && !(req.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    const clonedRequest = req.clone({
      setHeaders: headers,
    });
    
    //console.log('🔐 Token ajouté à la requête :', req.url);
    //console.log('📤 Authorization header :', clonedRequest.headers.get('Authorization')?.substring(0, 30) + '...');
    
    return next(clonedRequest);
  }

  // Si pas de token, passer la requête sans modification
  // console.log('⚠️ Aucun token trouvé pour la requête :', req.url);
  return next(req);
};
