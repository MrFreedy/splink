import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avoirs-item',
  imports: [],
  templateUrl: './avoirs-item.component.html',
  styleUrl: './avoirs-item.component.css'
})
export class AvoirsItemComponent {
  @Input() amount!: number;
  @Input() user!: string;
}
