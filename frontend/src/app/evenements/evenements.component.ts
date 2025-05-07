import { Component } from '@angular/core';
import { CalendarItemComponent } from '../calendar-item/calendar-item.component';
import { TaskItemComponent } from "../task-item/task-item.component";
import { ApiService } from '../services/api.service';
import { Helper } from '../utils/helper';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-evenements',
  imports: [CalendarItemComponent, TaskItemComponent, CommonModule, FormsModule, ModalComponent],
  templateUrl: './evenements.component.html',
  styleUrl: './evenements.component.css'
})
export class EvenementsComponent {
  isAddEventModalOpen = false;
  isSelectEditEventModalOpen = false;
  isEditEventModalOpen = false;
  isSelectDeleteEventModalOpen = false;

  user = JSON.parse(localStorage.getItem('user') || '{}');
  colocation = JSON.parse(localStorage.getItem('colocation') || '{}');

  availableFilterTitle: string = '';
  availableFilterPerson: string = '';
  availableFilterDate: string = '';

  overdueFilterTitle: string = '';
  overdueFilterPerson: string = '';
  overdueFilterDate: string = '';

  members: any[] = localStorage.getItem('colocation') ? JSON.parse(localStorage.getItem('colocation') || '{}').members : [];
  participants: { [key: string]: boolean } = {};
  participantNames: string[] = localStorage.getItem('colocation') ? JSON.parse(localStorage.getItem('colocation') || '{}').members.map((m: any) => m.username) : [];
  

  myTasks: any[] = [];
  allTasks: any[] = [];
  availableTasks: any[] = [];
  overdueTasks: any[] = [];

  eventToSubmit: any = {
    title:'',
    description: '',
    category: '',
    dueDate: '',
    assignedTo: '',
    createdBy: '',
  };

  constructor(private apiService: ApiService, private helper: Helper) {}

  ngOnInit() {
    this.getMyTasks();
    this.getAllTasks();
    this.getAvailableTasks();
    this.getOverdueTasks();

    this.participants = this.participantNames.reduce((acc: { [key: string]: boolean }, name: string) => {
      acc[name] = false;
      return acc;
    }, {});
  }

  getIcon(category: string): string {
    return this.helper.getIcon(category);
  }

  getMyTasks() {
    this.apiService.get(`/tasks/assigned/today/${this.user._id}`).subscribe(
      (response: any) => {
        this.myTasks = response;
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

  submitEvent() {
    const colocation = JSON.parse(localStorage.getItem('colocation') || '{}');
    const memberMap = colocation.members.reduce((acc: any, member: any) => {
      acc[member.username] = member.user_id;
      return acc;
    }, {});

    const newEvent = {
      title: this.eventToSubmit.title,
      description: this.eventToSubmit.description,
      category: this.eventToSubmit.category,
      assigned_to: memberMap[this.eventToSubmit.assignedTo],
      created_by: this.user._id,
      colocation_id: this.colocation._id,
      due_date: this.eventToSubmit.dueDate
    };

    this.apiService.post('/tasks', newEvent).subscribe(
      (response: any) => {
        alert('Événement ajouté avec succès !');
        this.closeAddEventModal();
        this.eventToSubmit = {
          title:'',
          description: '',
          category: '',
          dueDate: '',
          assignedTo: '',
          createdBy: '',
        };
        this.ngOnInit();
      },
      (error: any) => {
        console.error('Erreur ajout événement', error);
        alert('Erreur lors de l\'ajout de l\'événement.');
      }
    );
  }

  selectEditTask(task: any) {  

    const formattedDate = new Date(task.due_date).toISOString().slice(0, 10);

    this.eventToSubmit = {
      _id: task._id,
      title: task.title,
      description: task.description,
      category: task.category,
      dueDate: formattedDate,
      assignedTo: task.assigned_to.username,
      createdBy: task.created_by.username,
    };

    this.openEditEventModal();
  }

  submitEditEvent() {
    const colocation = JSON.parse(localStorage.getItem('colocation') || '{}');
    const memberMap = colocation.members.reduce((acc: any, member: any) => {
      acc[member.username] = member.user_id;
      return acc;
    }, {});
    const updatedEvent = {
      title: this.eventToSubmit.title,
      description: this.eventToSubmit.description,
      category: this.eventToSubmit.category,
      assigned_to: memberMap[this.eventToSubmit.assignedTo],
      created_by: this.user._id,
      colocation_id: this.colocation._id,
      due_date: this.eventToSubmit.dueDate
    };
    this.apiService.put(`/tasks/${this.eventToSubmit._id}`, updatedEvent).subscribe(
      (response: any) => {
        alert('Événement modifié avec succès !');
        this.closeEditEventModal();
        this.eventToSubmit = {
          title:'',
          description: '',
          category: '',
          dueDate: '',
          assignedTo: '',
          createdBy: '',
        };
        this.closeSelectEditEventModal();
        this.ngOnInit();
      },
      (error: any) => {
        console.error('Erreur modification événement', error);
        alert('Erreur lors de la modification de l\'événement.');
      }
    );
  }

  selectDeleteTask(task: any) {  

    const formattedDate = new Date(task.due_date).toISOString().slice(0, 10);

    this.eventToSubmit = {
      _id: task._id,
      title: task.title,
      description: task.description,
      category: task.category,
      dueDate: formattedDate,
      assignedTo: task.assigned_to.username,
      createdBy: task.created_by.username,
    };
  }

  submitDeleteEvent(task: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      this.apiService.delete(`/tasks/${task._id}`).subscribe(
        (response: any) => {
          alert('Événement supprimé avec succès !');
          this.closeSelectDeleteEventModal();
          this.ngOnInit();
        },
        (error: any) => {
          console.error('Erreur suppression événement', error);
          alert('Erreur lors de la suppression de l\'événement.');
        }
      );
    }
  }

  openAddEventModal() {
    this.isAddEventModalOpen = true;
  }

  closeAddEventModal() {
    this.isAddEventModalOpen = false;
    this.eventToSubmit = {
      title:'',
      description: '',
      category: '',
      dueDate: '',
      assignedTo: '',
      createdBy: '',
    };
  }

  openEditEventModal() {
    this.isEditEventModalOpen = true;
    this.isSelectEditEventModalOpen = false;
  }

  openSelectEditEventModal() {
    this.isSelectEditEventModalOpen = true;
  }

  closeEditEventModal() {
    this.isEditEventModalOpen = false;

    this.eventToSubmit = {
      title:'',
      description: '',
      category: '',
      dueDate: '',
      assignedTo: '',
      createdBy: '',
    };
  }

  closeSelectEditEventModal() {
    this.isSelectEditEventModalOpen = false;
  }

  openSelectDeleteEventModal() {
    this.isSelectDeleteEventModalOpen = true;
  }

  closeSelectDeleteEventModal() {
    this.isSelectDeleteEventModalOpen = false;

    this.eventToSubmit = {
      title:'',
      description: '',
      category: '',
      dueDate: '',
      assignedTo: '',
      createdBy: '',
    };
  }

}
