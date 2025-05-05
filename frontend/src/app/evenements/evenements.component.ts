import { Component } from '@angular/core';
import { CalendarItemComponent } from '../calendar-item/calendar-item.component';
import { TaskItemComponent } from "../task-item/task-item.component";
import { ApiService } from '../services/api.service';
import { Helper } from '../utils/helper';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-evenements',
  imports: [CalendarItemComponent, TaskItemComponent, CommonModule],
  templateUrl: './evenements.component.html',
  styleUrl: './evenements.component.css'
})
export class EvenementsComponent {

  user = JSON.parse(localStorage.getItem('user') || '{}');

  myTasks: any[] = [];

  constructor(private apiService: ApiService, private helper: Helper) {}

  ngOnInit() {
    this.getMyTasks();
  }

  getIcon(category: string): string {
    return this.helper.getIcon(category);
  }

  getMyTasks() {
    this.apiService.get(`/tasks/assigned/today/${this.user._id}`).subscribe(
      (response: any) => {
        this.myTasks = response;
        console.log('Tasks fetched successfully:', this.myTasks);
      },
      (error: any) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }
}
