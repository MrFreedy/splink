import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dettes-item',
  imports: [],
  templateUrl: './dettes-item.component.html',
  styleUrl: './dettes-item.component.css'
})

export class DettesItemComponent {
  @Input() amount!: number;
  @Input() user!: string;
}
