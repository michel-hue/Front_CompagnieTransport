# 📊 Tableau de Bord

Composant principal du tableau de bord pour l'administration Seller App.

## 📁 Structure

```
tableau-de-bord/
├── data-access/
│   ├── dashboard-data.service.ts   # Service pour récupérer les données
│   └── index.ts
├── tableau-de-bord.ts              # Composant TypeScript
├── tableau-de-bord.html            # Template HTML
├── tableau-de-bord.scss            # Styles
└── README.md
```

## 🎯 Fonctionnalités

### Statistiques affichées

- 💰 **Revenu total** - Somme de tous les revenus
- 📦 **Total commandes** - Nombre de commandes
- 🏪 **Total magasins** - Nombre de magasins/vendors
- 👥 **Total utilisateurs** - Nombre d'utilisateurs

### Sections

1. **Tuiles de statistiques** - Vue d'ensemble rapide
2. **Graphique de revenus** - Évolution dans le temps (à implémenter)
3. **Produits en rupture de stock** - Table des produits avec stock faible
4. **Commandes récentes** - Dernières commandes passées

## 🔌 Connexion API

### Endpoints requis (à créer dans l'API NestJS)

```typescript
// Statistiques globales
GET /api/v1/dashboard/statistics
→ { total_revenue, total_orders, total_stores, total_users, ... }

// Commandes récentes
GET /api/v1/orders?page=1&limit=5
→ [ { order_number, consumer_name, total, payment_status, ... } ]

// Produits faible stock
GET /api/v1/products/low-stock?page=1&limit=8
→ [ { name, quantity, stock, ... } ]

// Produits les plus vendus
GET /api/v1/products/top-selling?filter_by=this_year
→ [ { name, orders_count, ... } ]

// Données graphique
GET /api/v1/dashboard/revenue-chart?filter_by=this_year
→ { revenues: [...], commissions: [...], months: [...] }
```

## 📝 TODO

### Backend (API NestJS)

- [ ] Créer le module Dashboard
- [ ] Créer l'endpoint `GET /dashboard/statistics`
- [ ] Créer l'endpoint `GET /dashboard/revenue-chart`
- [ ] Ajouter la logique de filtrage par période
- [ ] Créer les endpoints pour produits (low-stock, top-selling)

### Frontend (Angular)

- [ ] Connecter `DashboardDataService` à l'API
- [ ] Implémenter le graphique ApexCharts
- [ ] Ajouter les filtres de période
- [ ] Implémenter la navigation vers les détails
- [ ] Ajouter un loader pendant le chargement

## 🚀 Utilisation

Le tableau de bord est accessible après connexion à l'adresse :

```
http://localhost:7500/dashboard
```

Il est automatiquement chargé après une connexion réussie.

## 🔒 Permissions

Le composant utilise les directives de permission :
- `*hasPermission="'product.index'"` - Pour afficher les produits
- `*hasPermission="'order.index'"` - Pour afficher les commandes
- `*hasPermission="'store.index'"` - Pour afficher les magasins

## 📊 État actuel

**Status :** ⚠️ En développement

- ✅ Structure créée
- ✅ Template HTML créé
- ✅ Styles de base ajoutés
- ✅ Service data-access créé
- ⚠️ Données mock (0) affichées
- ❌ Connexion API non implémentée
- ❌ Graphique non implémenté

## 🎨 Personnalisation

Les couleurs peuvent être personnalisées dans `tableau-de-bord.scss` :

```scss
.card-tiles {
  .icon-box {
    background: linear-gradient(135deg, #0da487 0%, #0c9275 100%);
    // Changez ici pour personnaliser la couleur
  }
}
```

## 📅 Créé le : 12 Octobre 2025

