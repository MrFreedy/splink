import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Helper {
  getIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'courses': return 'icons/grocery/grocery-normal.png';
      case 'loyer': return 'icons/loan/loan-normal.png';
      case 'électricité': return 'icons/electricity/electricity-normal.png';
      case 'covoiturage': return 'icons/covoiturage/covoiturage-normal.png';
      case 'poubelles': return 'icons/trash/trash-normal.png';
      default: return 'icons/default.png';
    }
  }

  formatAmount(amount: number): string {
    return amount.toFixed(2).replace('.', ',') + '€';
  }
}