import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-depense-item',
  imports: [],
  templateUrl: './depense-item.component.html',
  styleUrl: './depense-item.component.css'
})
export class DepenseItemComponent {
  @Input() icon = '';
  @Input() label = '';
  @Input() amount = '';
}
