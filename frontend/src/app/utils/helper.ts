import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Helper {
  getIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'abonnement': return 'icons/subscription/subscription-normal.png';
      case 'covoiturage': return 'icons/covoiturage/covoiturage-normal.png';
      case 'course': return 'icons/grocery/grocery-normal.png';
      case 'eau': return 'icons/water/water-normal.png';
      case 'electricite': return 'icons/electricity/electricity-normal.png';
      case 'fete': return 'icons/party/party-normal.png';
      case 'gaz': return 'icons/gas/gas-normal.png';
      case 'internet': return 'icons/internet/internet-normal.png';
      case 'loyer': return 'icons/loan/loan-normal.png';
      case 'nettoyage': return 'icons/cleaning/cleaning-normal.png';
      case 'poubelles': return 'icons/trash/trash-normal.png';
      case 'reparation': return 'icons/reparation/reparation-normal.png';
      case 'restaurant': return 'icons/restaurant/restaurant-normal.png';
      case 'autre': return 'icons/more/more-hover.png';
      default: return 'icons/more/more-hover.png';
    }
  }

  formatAmount(amount: number): string {
    return amount.toFixed(2).replace('.', ',') + '€';
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}