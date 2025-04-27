import { Component } from '@angular/core';
import { DepenseItemComponent } from '../depense-item/depense-item.component';
import { TaskItemComponent } from '../task-item/task-item.component';
import { IncomingTaskItemComponent } from '../incoming-task-item/incoming-task-item.component';

@Component({
  selector: 'app-dashboard',
  imports: [DepenseItemComponent, TaskItemComponent, IncomingTaskItemComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
