import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-card',
  imports: [CommonModule],
  templateUrl: './dashboard-card.component.html',
  standalone: true
})
export class DashboardCardComponent {
  @Input() title = '';
  @Input() gapClass = 'gap-20';

  @Input() primaryLabel = 'Ajouter';
  @Input() primaryIcon = 'icons/add/add-normal.png';
  @Input() primaryHoverIcon = 'icons/add/add-hover.png';
  @Input() primaryAction: () => void = () => {};

  @Input() secondaryLabel = 'Consulter';
  @Input() secondaryIcon = 'icons/view/view-normal.png';
  @Input() secondaryHoverIcon = 'icons/view/view-hover.png';
  @Input() secondaryAction: () => void = () => {};
}