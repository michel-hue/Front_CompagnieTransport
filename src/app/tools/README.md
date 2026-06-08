# 🛠️ Tools - Services Utilitaires

Ce dossier contient les services utilitaires partagés de l'application.

## 📁 Structure

```
tools/
├── api.service.ts          # Service pour les appels API
├── local-storage.service.ts # Service pour le localStorage
├── models.ts               # Interfaces partagées
├── index.ts                # Exports centralisés
└── README.md               # Documentation
```

## 🔧 Services Disponibles

### ApiService

Service centralisé pour tous les appels API.

**Fonctionnalités :**
- ✅ Gestion automatique des headers avec JWT
- ✅ Gestion centralisée des erreurs HTTP
- ✅ Support de tous les verbes HTTP (GET, POST, PUT, DELETE, PATCH)
- ✅ Support de l'upload de fichiers
- ✅ Pagination intégrée
- ✅ Recherche avec filtres

**Utilisation :**

```typescript
import { ApiService } from '@/app/tools';

constructor(private api: ApiService) {}

// GET
const users = await lastValueFrom(this.api.get('users'));

// POST
const newUser = await lastValueFrom(this.api.postWithParams('users', userData));

// GET avec pagination
const products = await lastValueFrom(
  this.api.getWithPaginateParams('products', 1, 10)
);
```

### LocalStorageService

Service pour gérer le localStorage de manière sécurisée.

**Fonctionnalités :**
- ✅ Sauvegarde/Récupération de JSON
- ✅ Sauvegarde/Récupération de strings
- ✅ Gestion d'erreurs intégrée
- ✅ Vérification d'existence de clés

**Utilisation :**

```typescript
import { LocalStorageService } from '@/app/tools';

constructor(private localStorage: LocalStorageService) {}

// Sauvegarder
this.localStorage.setJsonValue('user', userData);

// Récupérer
const user = this.localStorage.getJsonValue('user');

// Supprimer
this.localStorage.removeItem('user');
```

## 🔑 Configuration

L'URL de l'API est configurée dans `environment.ts` :

```typescript
export const environment = {
  apiUrl: 'http://localhost:3000/api/v1',
  API_KEY: '2023',
};
```

## 🛡️ Sécurité

- Les tokens JWT sont automatiquement ajoutés aux headers
- Gestion automatique de l'expiration du token (redirection vers /connexion)
- API_KEY incluse dans tous les appels

