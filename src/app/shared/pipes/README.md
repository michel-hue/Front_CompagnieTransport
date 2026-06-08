# Custom Currency Pipe

## Description
Pipe personnalisé pour formater les montants en devise XOF (Franc CFA) avec un formatage français.

## Utilisation dans les templates

### Basique (format XOF par défaut)
```html
{{ montant | customCurrency }}
<!-- Résultat: 1 500 (sans symbole) -->
```

### Avec code devise spécifique
```html
{{ montant | customCurrency:'EUR' }}
<!-- Résultat: 1 500 (format français sans symbole) -->
```

## Utilisation dans les datatables

Le pipe est automatiquement appliqué aux colonnes de type `'price'` :

```typescript
columns: [
  { 
    title: 'Prix Vente', 
    dataField: 'prix_vente', 
    type: 'price'  // ← Le pipe customCurrency sera automatiquement appliqué
  }
]
```

## Configuration dans le composant Table

Le pipe est déjà configuré dans le composant `Table` :
- Import : `admin_SELLER_essentiel/src/app/shared/components/ui/table/table.ts`
- Template : `admin_SELLER_essentiel/src/app/shared/components/ui/table/table.html`

```html
@if (columnHead?.type && columnHead?.type === 'price') { 
  {{ columnData[columnHead?.dataField] | customCurrency:'XOF' }} 
}
```

## Caractéristiques

- ✅ Format français (espaces comme séparateurs de milliers)
- ✅ Pas de décimales (arrondissement automatique)
- ✅ Gestion des valeurs nulles/undefined (affiche "0")
- ✅ Support de toutes les devises (EUR, USD, XOF, etc.)
- ✅ Standalone (peut être importé partout)

## Exemples de sortie

| Entrée  | Sortie     |
|---------|------------|
| 1500    | 1 500      |
| 1500.50 | 1 501      |
| null    | 0          |
| "2000"  | 2 000      |

## Extension

Pour afficher le code devise après le montant, modifiez le pipe :

```typescript
return `${valueWithoutCurrency} ${currencyCode}`;
```

Résultat : `1 500 XOF`


