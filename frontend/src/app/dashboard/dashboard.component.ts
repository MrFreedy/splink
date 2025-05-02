import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { DepenseItemComponent } from '../depense-item/depense-item.component';
import { TaskItemComponent } from '../task-item/task-item.component';
import { IncomingTaskItemComponent } from '../incoming-task-item/incoming-task-item.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DepenseItemComponent, TaskItemComponent, IncomingTaskItemComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user = JSON.parse(localStorage.getItem('user') || '{}');
  colocationId = this.user.colocation_id;

  username = null;
  depenses: any[] = [];
  depensesToSubmit: any = {
    title: '',
    amount: null,
    category: '',
    paymentDate: '',
    payer: ''
  };

  todayTasksToSubmit: any = {
    title:'',
    description: '',
    category: '',
    dueDate: '',
    assignedTo: '',
    createdBy: '',
  };

  upcomingTasksToSubmit: any = {
    title:'',
    description: '',
    category: '',
    dueDate: '',
    assignedTo: '',
    createdBy: '',
  };

  userTasks: any[] = [];
  colocationTasks: any[] = [];
  upcomingTasks: any[] = [];
  
  participants: { [key: string]: boolean } = {};
  participantNames: string[] = localStorage.getItem('colocation') ? JSON.parse(localStorage.getItem('colocation') || '{}').members.map((m: any) => m.username) : [];
  paymentDate: string = '';
  isDepenseModalOpen = false;
  isTodayTasksOpen = false;
  isUpcomingTasksOpen = false;

  constructor(private apiService: ApiService, private router: Router) {
    const user = localStorage.getItem('user');
    if (user) {
      this.username = JSON.parse(user).username;
    }
  }

  ngOnInit() {
    this.apiService.get(`/depenses/colocation/${this.colocationId}/last`).subscribe((data: any) => {
      this.depenses = data;
      this.depenses.forEach(depense => {
        depense.date = new Date(depense.date).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      });
    });

    this.participants = this.participantNames.reduce((acc: { [key: string]: boolean }, name: string) => {
      acc[name] = false;
      return acc;
    }, {});

    this.apiService.get(`/tasks/colocation/${this.colocationId}`).subscribe((data: any) => {
      this.colocationTasks = data;
      this.colocationTasks.forEach(task => {
        task.dueDate = new Date(task.dueDate).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      });
    });

    this.apiService.get(`/tasks/colocation/${this.colocationId}/upcoming`).subscribe((data: any) => {
      this.upcomingTasks = data;
      this.upcomingTasks.forEach(task => {
        task.dueDate = this.capitalizeFirstLetter(new Date(task.due_date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          month: 'long',
          day: '2-digit'
        }));
      });
    });

    this.apiService.get(`/tasks/assigned/today/${this.user._id}`).subscribe((data: any) => {
      this.userTasks = data;
      this.userTasks.forEach(task => {
        task.dueDate = new Date(task.dueDate).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      });
    });
  }

  getIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'courses':
        return 'icons/grocery/grocery-normal.png';
      case 'loyer':
        return 'icons/loan/loan-normal.png';
      case 'électricité':
        return 'icons/electricity/electricity-normal.png';
      case 'covoiturage':
        return 'icons/covoiturage/covoiturage-normal.png';
      case 'poubelles':
        return 'icons/trash/trash-normal.png';
      default:
        return 'icons/default.png';
    }
  }
  
  formatAmount(amount: number): string {
    return amount.toFixed(2).replace('.', ',') + '€';
  }

  openDepenseModal(){
    this.isDepenseModalOpen = true;
  }

  openTodayTasks() {
    this.isTodayTasksOpen = !this.isTodayTasksOpen;
  }

  openUpcomingTasks() {
    this.isUpcomingTasksOpen = !this.isUpcomingTasksOpen;
  }

  closeDepenseModal(){
    this.isDepenseModalOpen = false;
    this.depensesToSubmit = {
      title: '',
      amount: null,
      category: '',
      paymentDate: '',
      payer: ''
    };
  }

  closeTodayTasks() {
    this.isTodayTasksOpen = false;
    this.todayTasksToSubmit = {
      title: '',
      description: '',
      category: '',
      dueDate: '',
      assignedTo: '',
      createdBy: '',
    };
  }

  closeUpcomingTasks() {
    this.isUpcomingTasksOpen = false;
    this.upcomingTasksToSubmit = {
      title: '',
      description: '',
      category: '',
      dueDate: '',
      assignedTo: '',
      createdBy: '',
    };
  }

  submitDepense() {
    if (!this.depensesToSubmit.title || !this.depensesToSubmit.amount || !this.depensesToSubmit.category || !this.depensesToSubmit.paymentDate || !this.depensesToSubmit.payer) {
      alert('Merci de remplir tous les champs.');
      return;
    }
  
    this.apiService.get(`/colocations/${this.colocationId}/members`).subscribe((members: any) => {
      const memberMap = members.reduce((acc: any, member: any) => {
        acc[member.user_id.username] = member.user_id._id;
        return acc;
      }, {});
  
      const paid_by_id = memberMap[this.depensesToSubmit.payer];
      const shared_between_ids = Object.keys(this.participants)
        .filter(name => this.participants[name])
        .map(name => memberMap[name]);
  
      const newDepense = {
        title: this.depensesToSubmit.title,
        amount: parseFloat(this.depensesToSubmit.amount),
        category: this.depensesToSubmit.category,
        paymentDate: new Date(this.depensesToSubmit.paymentDate),
        paid_by: paid_by_id,
        shared_between: shared_between_ids,
        colocation_id: this.colocationId,
        status: "à payer"
      };
  
      this.apiService.post('/depenses', newDepense).subscribe({
        next: (response) => {
          alert('Dépense ajoutée avec succès !');
          this.closeDepenseModal();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Erreur ajout dépense', err);
          alert('Erreur lors de l\'ajout de la dépense.');
        }
      });
    });
  }

  submitTodayTask(){
    if (!this.todayTasksToSubmit.title || !this.todayTasksToSubmit.category) {
      alert('Merci de remplir tous les champs.');
      return;
    }

    this.apiService.get(`/colocations/${this.colocationId}/members`).subscribe((members: any) => {
      const memberMap = members.reduce((acc: any, member: any) => {
        acc[member.user_id.username] = member.user_id._id;
        return acc;
      }, {});
  
      const assigned_to_id = this.user._id;
      const created_by_id = this.user._id;
  
      const newTodayTask = {
        title: this.todayTasksToSubmit.title,
        description: this.todayTasksToSubmit.description,
        category: this.todayTasksToSubmit.category,
        assigned_to: assigned_to_id,
        created_by: created_by_id,
        colocation_id: this.colocationId,
        due_date: new Date(Date.now()),
      };
  
      this.apiService.post('/tasks', newTodayTask).subscribe({
        next: (response) => {
          alert('Tâche ajoutée avec succès !');
          this.closeTodayTasks();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Erreur ajout dépense', err);
          alert('Erreur lors de l\'ajout de la dépense.');
        }
      });
    });
  }

  submitUpcomingTask() {
    if (!this.upcomingTasksToSubmit.title || !this.upcomingTasksToSubmit.category || !this.upcomingTasksToSubmit.assignedTo || !this.upcomingTasksToSubmit.dueDate) {
      alert('Merci de remplir tous les champs.');
      return;
    }
  
    this.apiService.get(`/colocations/${this.colocationId}/members`).subscribe((members: any) => {
      const memberMap = members.reduce((acc: any, member: any) => {
        acc[member.user_id.username] = member.user_id._id;
        return acc;
      }, {});
  
      const assigned_to_id = memberMap[this.upcomingTasksToSubmit.assignedTo];
      const created_by_id = this.user._id;      
  
      const newUpcomingTask = {
        title: this.upcomingTasksToSubmit.title,
        description: this.upcomingTasksToSubmit.description,
        category: this.upcomingTasksToSubmit.category,
        assigned_to: assigned_to_id,
        created_by: created_by_id,
        colocation_id: this.colocationId,
        due_date: new Date(this.upcomingTasksToSubmit.dueDate),
      };
      
      this.apiService.post('/tasks', newUpcomingTask).subscribe({
        next: (response) => {
          alert('Tâche ajoutée avec succès !');
          this.closeUpcomingTasks();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Erreur ajout dépense', err);
          alert('Erreur lors de l\'ajout de la dépense.');
        }
      });
    });
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  goToPage(name: string) {
    switch (name) {
      case 'evenements':
        this.router.navigate(['/evenements']);
        break;
      case 'depenses':
        this.router.navigate(['/depenses']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }

}
