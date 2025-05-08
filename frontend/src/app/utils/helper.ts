import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Helper {
  getIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'abonnement': return 'icons/subscription/subscription-hover.png';
      case 'covoiturage': return 'icons/covoiturage/covoiturage-hover.png';
      case 'course': return 'icons/grocery/grocery-hover.png';
      case 'eau': return 'icons/water/water-hover.png';
      case 'electricite': return 'icons/electricity/electricity-hover.png';
      case 'fete': return 'icons/party/party-hover.png';
      case 'gaz': return 'icons/gas/gas-hover.png';
      case 'internet': return 'icons/internet/internet-hover.png';
      case 'loyer': return 'icons/loan/loan-hover.png';
      case 'loyer': return 'icons/loan/loan-hover.png';
      case 'nettoyage': return 'icons/cleaning/cleaning-hover.png';
      case 'poubelles': return 'icons/trash/trash-hover.png';
      case 'reparation': return 'icons/reparation/reparation-hover.png';
      case 'restaurant': return 'icons/restaurant/restaurant-hover.png';
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