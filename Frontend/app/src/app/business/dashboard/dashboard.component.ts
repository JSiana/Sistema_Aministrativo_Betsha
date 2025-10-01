import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';


@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // Etiquetas para los meses
  pagosLabels: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'];

  // Datos y configuración de la gráfica
  pagosData: ChartConfiguration<'bar'>['data'] = {
    labels: this.pagosLabels,
    datasets: [
      {

        data: [12, 19, 15, 25, 22,12,14],  // Aquí puedes poner datos reales luego
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  pagosOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  pagosChartType: ChartType = 'bar';

calendarOptions: CalendarOptions = {
  initialView: 'dayGridMonth',
  plugins: [dayGridPlugin],
  headerToolbar: false,
  selectable: false,
  editable: false,
  events: [],
  height: '517px',
  locale: esLocale,    // <--- Aquí pones el idioma español
};




}
