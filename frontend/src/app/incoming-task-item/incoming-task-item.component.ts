import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-incoming-task-item',
  imports: [],
  templateUrl: './incoming-task-item.component.html',
  styleUrl: './incoming-task-item.component.css'
})
export class IncomingTaskItemComponent {
  @Input() icon = '';
  @Input() label = '';
  @Input() date = '';
}
