import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
  standalone: true
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined, currencyCode: string = 'XOF', display: 'symbol' | 'code' | 'name' = 'symbol', digitsInfo: string = '1.2-2'): string {
    // Gérer les valeurs nulles ou non définies
    if (value === null || value === undefined || value === '') {
      return '0';
    }

    // Convertir en nombre si c'est une chaîne
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    // Vérifier si c'est un nombre valide
    if (isNaN(numericValue)) {
      return '0';
    }

    // Format the value using the built-in currency pipe
    const formattedValue = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericValue);

    // Remove the currency symbol from the formatted value
    const valueWithoutCurrency = formattedValue.replace(/[$€]/g, '').trim();

    // Add the currency symbol after the value (optionnel)
    // return `${valueWithoutCurrency} ${currencyCode}`;
    return `${valueWithoutCurrency}`;
  }
}

