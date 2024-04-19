// angular import
import { Component, ViewChild } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../../chart/apex-chart/apex-chart.component';
import { Historico } from '../interfaces/historico.interface';
import { HistoricoService } from '../services/historicos.service';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.scss'
})
export default class HistoricoComponent {

  @ViewChild('chart') chart: ChartComponent;

  areaAngleChart: Partial<ChartOptions>;
  categories: string[] = [];
  hotelesData: number[] = [];
  habitacionesData: number[] = [];
  habitacionesDisponiblesData: number[] = [];
  habitacionesReservadasData: number[] = [];
  huespedesData: number[] = [];
  serviciosData: number[] = [];

  constructor(private historicoService: HistoricoService) {}

  ngOnInit() {
    this.loadDataForChart();
  }

  loadDataForChart() {
    this.historicoService.getAllHistoricos().subscribe((historicos: Historico[]) => {
      console.log(historicos);
      historicos.forEach((historico: Historico) => {
        const fecha = new Date(historico.fecha);
        // Obtener día, mes y año
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const año = fecha.getFullYear();
        // Formatear la fecha en "dd/mm/yyyy"
        const fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${año}`;
        this.categories.push(fechaFormateada);
        this.hotelesData.push(historico.hotelesTotales)
        this.habitacionesData.push(historico.habitacionesTotales);
        this.habitacionesDisponiblesData.push(historico.habitacionesDisponibles);
        this.habitacionesReservadasData.push(historico.habitacionesReservadas);
        this.huespedesData.push(historico.huespedesTotales);
        this.serviciosData.push(historico.serviciosTotales);
      });

      // Configura el gráfico con los datos obtenidos
      this.areaAngleChart = {
        chart: {
          height: 380,
          type: 'area',
          stacked: false,
        },
        stroke: {
          curve: 'straight',
        },
        series: [
          {
            name: 'Hoteles',
            data: this.hotelesData,
          },
          {
            name: 'Habitaciones',
            data: this.habitacionesData,
          },
          {
            name: 'Habitaciones disponibles',
            data: this.habitacionesDisponiblesData,
          },
          {
            name: 'Habitaciones reservadas',
            data: this.habitacionesReservadasData,
          },
          {
            name: 'Huéspedes',
            data: this.huespedesData,
          },
          {
            name: 'Servicios',
            data: this.serviciosData,
          },
        ],
        xaxis: {
          categories: this.categories,
        },
        tooltip: {
          followCursor: true,
        },
        fill: {
          opacity: 1,
        },
      };
    });
  }


}
