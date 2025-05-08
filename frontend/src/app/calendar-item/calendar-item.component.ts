import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendar-item',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar-item.component.html',
  styleUrl: './calendar-item.component.css'
})
export class CalendarItemComponent implements OnChanges {
  @Input() tasks: any[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: frLocale,
    plugins: [dayGridPlugin, interactionPlugin],
    events: []
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks'] && this.tasks) {
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.tasks.map(task => ({
          title: task.title.length > 15 ? task.title.slice(0, 15) + '…' : task.title,
          allDay: true,
          start: task.due_date,
          extendedProps: {
            fullTitle: task.title
          }
        })),
        eventDidMount: (info) => {
          const fullTitle = info.event.extendedProps['fullTitle'];
          if (fullTitle) {
            info.el.setAttribute('title', fullTitle);
          }
        }
      };
    }
  }
}