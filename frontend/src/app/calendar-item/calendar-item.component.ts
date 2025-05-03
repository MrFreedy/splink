import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // pour typer tes options
import dayGridPlugin from '@fullcalendar/daygrid'; // plugin de vue "mois"
import interactionPlugin from '@fullcalendar/interaction'; // pour rendre le calendrier interactif
import frLocale from '@fullcalendar/core/locales/fr'; // pour la localisation en français
import { FullCalendarModule } from '@fullcalendar/angular'; // le module Angular

@Component({
  selector: 'app-calendar-item',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar-item.component.html',
  styleUrl: './calendar-item.component.css'
})
export class CalendarItemComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: frLocale,
    plugins: [dayGridPlugin, interactionPlugin],
    events: [
      { title: 'Événement A', date: '2025-05-01' },
      { title: 'Événement B', date: '2025-05-15' }
    ]
  };
}
