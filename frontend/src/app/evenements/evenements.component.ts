import { Component } from '@angular/core';
import { CalendarItemComponent } from '../calendar-item/calendar-item.component';
import { TaskItemComponent } from "../task-item/task-item.component";
import { ApiService } from '../services/api.service';
import { Helper } from '../utils/helper';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-evenements',
  imports: [CalendarItemComponent, TaskItemComponent, CommonModule, FormsModule],
  templateUrl: './evenements.component.html',
  styleUrl: './evenements.component.css'
})
export class EvenementsComponent {

  user = JSON.parse(localStorage.getItem('user') || '{}');

  availableFilterTitle: string = '';
  availableFilterPerson: string = '';
  availableFilterDate: string = '';

  overdueFilterTitle: string = '';
  overdueFilterPerson: string = '';
  overdueFilterDate: string = '';

  myTasks: any[] = [];
  allTasks: any[] = [];
  availableTasks: any[] = [];
  overdueTasks: any[] = [];

  constructor(private apiService: ApiService, private helper: Helper) {}

  ngOnInit() {
    this.getMyTasks();
    this.getAllTasks();
    this.getAvailableTasks();
    this.getOverdueTasks();
  }

  getIcon(category: string): string {
    return this.helper.getIcon(category);
  }

  getMyTasks() {
    this.apiService.get(`/tasks/assigned/today/${this.user._id}`).subscribe(
      (response: any) => {
        this.myTasks = response;
        console.log('My Tasks fetched successfully:', this.myTasks);
      },
      (error: any) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  getAllTasks(){
    this.apiService.get(`/tasks/colocation/${this.user.colocation_id}`).subscribe(
      (response: any) => {
        this.allTasks = response;
        console.log('All Tasks fetched successfully:', this.allTasks);
      },
      (error: any) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  getAvailableTasks() {
    this.apiService.get(`/tasks/colocation/${this.user.colocation_id}/available`).subscribe(
      (response: any) => {
        this.availableTasks = response;
        console.log('Available Tasks fetched successfully:', this.availableTasks);
      },
      (error: any) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  getOverdueTasks() {
    this.apiService.get(`/tasks/colocation/${this.user.colocation_id}/overdue`).subscribe(
      (response: any) => {
        this.overdueTasks = response;
        console.log('Overdue Tasks fetched successfully:', this.overdueTasks);
      },
      (error: any) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  get uniqueAvaibleTasksAssignedByNames(): string[] {
    const names = this.availableTasks
      .map(task => task.assigned_to.username)
      .filter((name, index, self) => name && self.indexOf(name) === index);

    return names;
  }

  get uniqueOverdueTasksAssignedByNames(): string[] {
    const names = this.overdueTasks
      .map(task => task.assigned_to.username)
      .filter((name, index, self) => name && self.indexOf(name) === index);
    return names;
  }

  get availableFilteredTasks() {
    return this.availableTasks
      .filter(task => {
        const matchTitle = this.availableFilterTitle
          ? task.title.toLowerCase().includes(this.availableFilterTitle.toLowerCase())
          : true;
        const matchPerson = this.availableFilterPerson
          ? task.assigned_to?.toLowerCase().includes(this.availableFilterPerson.toLowerCase())
          : true;
        const matchDate = this.availableFilterDate
          ? task.due_date?.slice(0, 10) === this.availableFilterDate
          : true;

        return matchTitle && matchPerson && matchDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.paymentDate).getTime();
        const dateB = new Date(b.paymentDate).getTime();
        return dateB - dateA;
      });
  }

  get overdueFilteredTasks() {
    return this.overdueTasks
      .filter(task => {
        const matchTitle = this.overdueFilterTitle
          ? task.title.toLowerCase().includes(this.overdueFilterTitle.toLowerCase())
          : true;
        const matchPerson = this.overdueFilterPerson
          ? task.assigned_to?.toLowerCase().includes(this.overdueFilterPerson.toLowerCase())
          : true;
        const matchDate = this.overdueFilterDate
          ? task.due_date?.slice(0, 10) === this.overdueFilterDate
          : true;

        return matchTitle && matchPerson && matchDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.paymentDate).getTime();
        const dateB = new Date(b.paymentDate).getTime();
        return dateB - dateA;
      });
  }
}
