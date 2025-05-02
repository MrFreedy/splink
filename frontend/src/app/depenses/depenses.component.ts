import { Component } from '@angular/core';
import { DepenseDueItemComponent } from '../depense-due-item/depense-due-item.component';
import { ChartItemComponent } from '../chart-item/chart-item.component';

@Component({
  selector: 'app-depenses',
  imports: [ChartItemComponent, DepenseDueItemComponent],
  templateUrl: './depenses.component.html',
  styleUrl: './depenses.component.css'
})
export class DepensesComponent {

}
