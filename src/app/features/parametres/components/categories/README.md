# 📦 Module de Gestion des Catégories

## 🎯 Description

Module complet de gestion des catégories de produits pour Seller App. 
Permet de créer, modifier, supprimer et organiser des catégories avec support de hiérarchie (catégories parentes/enfants).

---

## 📂 Structure

```
categories/
├── categories.ts              # Composant principal
├── categories.html            # Template
├── categories.scss            # Styles
├── data-access/
│   ├── categorie-data.service.ts  # Service API
│   └── index.ts               # Exports
└── modals/
    └── form-categorie/
        ├── modal-form-categorie.ts    # Modal formulaire
        ├── modal-form-categorie.html  # Template modal
        └── modal-form-categorie.scss  # Styles modal
```

---

## ✨ Fonctionnalités

### 1. Liste des Catégories
- ✅ Affichage en tableau avec pagination
- ✅ Tri par colonne
- ✅ Recherche et filtres
- ✅ Actions : Éditer, Supprimer
- ✅ Sélection multiple

### 2. Création/Édition de Catégorie
- ✅ Formulaire complet avec validation
- ✅ Champs principaux :
  - Code unique
  - Nom de la catégorie
  - Description
  - Catégorie parente (pour hiérarchie)
  
- ✅ Champs SEO :
  - Slug (généré automatiquement)
  - Meta Title
  - Meta Description

- ✅ Apparence :
  - Icône (RemixIcon)
  - Couleur personnalisée
  - Ordre d'affichage
  - Visibilité
  - Mise en vedette

### 3. Hiérarchie
- ✅ Support des catégories parentes/enfants
- ✅ Création de sous-catégories
- ✅ Affichage du nom de la catégorie parente dans la liste

### 4. Gestion
- ✅ Suppression avec confirmation
- ✅ Soft delete (status)
- ✅ Messages de succès/erreur
- ✅ Gestion des erreurs API

---

## 🔌 API Endpoints Utilisés

### GET /api/v1/categories
Récupère toutes les catégories avec pagination

**Query Params :**
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 10)
- `parentid` : Filtrer par catégorie parente (optionnel)

**Réponse :**
```typescript
{
  data: Categorie[],
  meta: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

### GET /api/v1/categories/:id
Récupère une catégorie par ID

### POST /api/v1/categories
Crée une nouvelle catégorie

**Body :**
```typescript
{
  code: string,              // Requis
  name: string,              // Requis
  description?: string,
  parentid?: string,
  slug?: string,
  meta_title?: string,
  meta_description?: string,
  icon?: string,
  color?: string,
  sort_order?: number,
  is_visible?: boolean,
  is_featured?: boolean
}
```

### PATCH /api/v1/categories/:id
Met à jour une catégorie

### DELETE /api/v1/categories/:id
Supprime une catégorie (soft delete)

---

## 🎨 Interface Utilisateur

### Tableau
- Colonnes : No, Code, Nom, Description, Catégorie parente, Ordre, Visible, En vedette
- Badges colorés pour les booléens
- Troncature automatique des textes longs
- Actions : Éditer, Supprimer

### Modal de Formulaire
- 3 sections : Informations principales, SEO, Apparence
- Validation en temps réel
- Génération automatique du slug
- Sélecteur de couleur
- Switches pour les options booléennes

---

## 📊 Modèle de Données

```typescript
interface Categorie {
  id: number;
  categorieid: string;        // UUID
  code: string;               // Ex: CAT-001
  name: string;               // Ex: Huiles Essentielles
  description?: string;
  parentid?: string;          // UUID de la catégorie parente
  slug?: string;              // Ex: huiles-essentielles
  meta_title?: string;
  meta_description?: string;
  image_url?: string;
  icon?: string;              // Classe RemixIcon
  color?: string;             // HEX (#073C98)
  sort_order?: number;        // Ordre d'affichage (0 = premier)
  is_visible?: boolean;       // Visible sur le site
  is_featured?: boolean;      // Mis en vedette
  createdby: string;
  createdon: string;
  updatedby?: string;
  updatedon?: string;
  deletedby?: string;
  deletedon?: string;
  status: number;             // 1 = actif, 0 = supprimé
  
  // Relations (calculées)
  parent_name?: string;       // Nom de la catégorie parente
  products_count?: number;    // Nombre de produits
}
```

---

## 🚀 Utilisation

### Dans le Template
```html
<app-categories />
```

### Navigation
- **Menu Paramètres** → **Gestion des Catégories** (premier onglet)
- Route : `/parametres?active=categories` ou `/parametres/categories`

---

## 🎯 Intégration

### 1. Menu Paramètres
Le composant est intégré dans `parametres.html` comme premier onglet (au-dessus de Profil).

### 2. Routes
Route définie dans `parametres.routes.ts` :
```typescript
{
  path: 'categories',
  component: CategoriesComponent,
}
```

### 3. Permissions
TODO: Ajouter la vérification des permissions pour :
- Voir les catégories
- Créer des catégories
- Modifier des catégories
- Supprimer des catégories

---

## ✅ Checklist de Développement

- [x] Créer le service de données
- [x] Créer le composant principal
- [x] Créer le modal de formulaire
- [x] Ajouter l'onglet dans Paramètres
- [x] Ajouter la route
- [x] Validation de formulaire
- [x] Gestion des erreurs
- [x] Messages de succès
- [x] Support de la hiérarchie
- [x] Génération automatique du slug
- [ ] Connecter avec l'API Backend
- [ ] Tester les opérations CRUD
- [ ] Ajouter les permissions
- [ ] Upload d'image de catégorie
- [ ] Prévisualisation de la hiérarchie

---

## 🐛 TODO / Améliorations

1. **Upload d'image**
   - Permettre l'upload d'une image pour la catégorie
   - Intégrer avec MinIO

2. **Prévisualisation**
   - Vue arbre de la hiérarchie des catégories
   - Drag & drop pour réorganiser

3. **Statistiques**
   - Nombre de produits par catégorie
   - Catégories les plus populaires

4. **Filtres avancés**
   - Filtrer par catégorie parente
   - Filtrer par visibilité
   - Filtrer par status

5. **Export**
   - Export CSV/Excel
   - Import en masse

---

## 📝 Notes

- Le composant utilise le système de design Seller App (couleurs bleu 2, bleu 3 et jaune)
- Les icônes sont issues de RemixIcon
- Le tableau utilise le composant `app-table` partagé
- La validation utilise les validators Angular natifs
- Le service utilise `ApiService` pour les appels HTTP

---

**Date de création :** 14 Octobre 2025  
**Auteur :** Assistant IA  
**Statut :** ✅ Prêt pour les tests


