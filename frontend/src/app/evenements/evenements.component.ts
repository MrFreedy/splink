import { Component } from '@angular/core';
import { CalendarItemComponent } from '../calendar-item/calendar-item.component';
import { TaskItemComponent } from "../task-item/task-item.component";

@Component({
  selector: 'app-evenements',
  imports: [CalendarItemComponent, TaskItemComponent],
  templateUrl: './evenements.component.html',
  styleUrl: './evenements.component.css'
})
export class EvenementsComponent {

}
