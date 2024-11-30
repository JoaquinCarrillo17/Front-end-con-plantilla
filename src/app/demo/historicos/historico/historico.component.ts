import { Component, ViewChild, OnInit } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../../chart/apex-chart/apex-chart.component';
import { HistoricoService } from '../services/historicos.service';
import { HotelesService } from '../../hoteles/services/hoteles.service';
import { SharedModule } from '../../../theme/shared/shared.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss'],
  imports: [SharedModule, NgApexchartsModule, FormsModule],
  standalone: true,
})
export default class HistoricoComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;

  reservasChart: Partial<ChartOptions>;
  gananciasChart: Partial<ChartOptions>;
  habitacionesChart: Partial<ChartOptions>;

  hoteles: any;
  years: any = [];
  selectedHotel: any;
  selectedYear: any;

  idUsuario: any;
  esSuperAdmin: boolean;

  dataLoaded: boolean = false;

  constructor(
    private historicoService: HistoricoService,
    private hotelesService: HotelesService,
  ) {}

  ngOnInit() {
    this.idUsuario = localStorage.getItem('usuario');
    this.esSuperAdmin = localStorage.getItem('superadmin') === 'true';
    this.loadInitialData();
  }

  loadInitialData() {
    // Obtener lista de hoteles
    this.hotelesService.getAllHoteles().subscribe((hoteles) => {
      this.hoteles = hoteles;
      //this.selectedHotel = hoteles[0]?.id; // Selecciona el primer hotel por defecto
    });

    // Generar lista de años
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
    //this.selectedYear = currentYear; // Año actual por defecto
  }

  generateCharts() {
    this.dataLoaded = false;

    // Si no es superadmin, selecciona automáticamente el hotel del usuario actual
    let hotelId = null;
    if (!this.esSuperAdmin) {
      const hotelDelUsuario = this.hoteles.find(
        (hotel) => hotel.idUsuario == this.idUsuario,
      );
      hotelId = hotelDelUsuario.id;
    } else {
      // Usar el hotel seleccionado en el dropdown (si es superadmin)
      hotelId = this.selectedHotel || null;
    }

    this.historicoService
      .getEstadisticas(hotelId, this.selectedYear)
      .subscribe((data) => {
        const monthNames = [
          'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
          'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
        ];
        // Configurar Reservas por Mes
        const reservasPorMes = Object.keys(data.reservasPorMes).map((mes) => ({
          x: monthNames[parseInt(mes, 10) - 1],
          y: data.reservasPorMes[mes],
        }));
        this.reservasChart = {
          chart: {
            type: 'bar',
            height: 350,
          },
          series: [
            {
              name: 'Reservas',
              data: reservasPorMes,
            },
          ],
          xaxis: {
            categories: Object.keys(data.reservasPorMes).map(
              (mes) => monthNames[parseInt(mes, 10) - 1],
            ),
          },
          tooltip: {
            followCursor: true,
          },
        };

        // Configurar Ganancias por Mes
        const gananciasPorMes = Object.keys(data.gananciasPorMes).map(
          (mes) => ({
            x: monthNames[parseInt(mes, 10) - 1],
            y: data.gananciasPorMes[mes],
          }),
        );
        this.gananciasChart = {
          chart: {
            type: 'bar',
            height: 350,
          },
          series: [
            {
              name: 'Ganancias (€)',
              data: gananciasPorMes,
            },
          ],
          xaxis: {
            categories: Object.keys(data.gananciasPorMes).map(
              (mes) => monthNames[parseInt(mes, 10) - 1],
            ),
          },
          tooltip: {
            followCursor: true,
          },
        };

        // Configurar Habitaciones
        this.habitacionesChart = {
          chart: {
            type: 'pie',
            height: 350,
          },
          series: [
            data.totalHabitaciones,
            data.habitacionesReservadas,
            data.habitacionesLibres,
          ],
          labels: ['Total', 'Reservadas', 'Disponibles'],
          legend: {
            show: true, // Mostrar leyenda
            position: 'right', // Posición de la leyenda (puedes usar 'top', 'bottom', 'left', 'right')
          },
          tooltip: {
            followCursor: true,
            y: {
              formatter: function (val) {
                return `${val} habitaciones`; // Formato del tooltip
              },
            },
          },
        };
        this.dataLoaded = true;
      });
  }
}
