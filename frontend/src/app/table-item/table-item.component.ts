import { Component, Input, EventEmitter, Output  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-item',
  imports: [CommonModule, FormsModule],
  templateUrl: './table-item.component.html',
  styleUrl: './table-item.component.css'
})
export class TableItemComponent {
  @Input() title: string = '';
  @Input() filterPerson: string = '';
  @Input() filterTitle: string = '';
  @Input() filterDate: string = '';
  @Output() filterPersonChange = new EventEmitter<string>();
  @Output() filterTitleChange = new EventEmitter<string>();
  @Output() filterDateChange = new EventEmitter<string>();
  @Input() uniquePeople: string[] = [];
  @Input() filteredItems: any[] = [];
  @Input() noItemMessage: string = 'Rien à afficher';
}
