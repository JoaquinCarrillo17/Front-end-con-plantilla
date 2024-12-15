import { Component, ViewChild, OnInit } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../../chart/apex-chart/apex-chart.component';
import { HistoricoService } from '../services/historicos.service';
import { HotelesService } from '../../hoteles/services/hoteles.service';
import { SharedModule } from '../../../theme/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AddHotelComponent } from '../../hoteles/add-hotel/add-hotel.component';
import { MatDialog } from '@angular/material/dialog';
import { HabitacionesService } from '../../habitaciones/services/habitaciones.service';
import { AddRoomComponent } from '../../habitaciones/add-room/add-room.component';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss'],
  imports: [SharedModule, NgApexchartsModule, FormsModule],
  standalone: true,
})
export default class HistoricoComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;

  isSpinnerVisible: boolean = false;

  reservasChart: Partial<ChartOptions>;
  gananciasChart: Partial<ChartOptions>;
  habitacionesChart: Partial<ChartOptions>;

  showNotification: boolean = false;
  message: any;
  color: boolean = false;

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
    private dialog: MatDialog,
    private habitacionesService: HabitacionesService,
  ) {}

  ngOnInit() {
    this.idUsuario = localStorage.getItem('usuario');
    this.esSuperAdmin = localStorage.getItem('superadmin') === 'true';
    this.loadInitialData();
    if (!this.esSuperAdmin) this.comprobarHotelUsuario();
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

    this.historicoService.getEstadisticas(hotelId, this.selectedYear).subscribe(
      (data) => {
        const monthNames = [
          'ENERO',
          'FEBRERO',
          'MARZO',
          'ABRIL',
          'MAYO',
          'JUNIO',
          'JULIO',
          'AGOSTO',
          'SEPTIEMBRE',
          'OCTUBRE',
          'NOVIEMBRE',
          'DICIEMBRE',
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
      },
      (error) => {
        this.showNotification = true;
        this.message = 'Error cargando las estadísticas del hotel';
        this.color = false;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      },
    );
  }

  comprobarHotelUsuario(): void {
    this.isSpinnerVisible = true; // Mostrar spinner mientras se carga la lista de hoteles
    this.hotelesService.getHotelPorUsuario(this.idUsuario).subscribe(
      (response) => {
        this.isSpinnerVisible = false;
      },
      (error) => {
        if (error.status === 404) {
          // Si no tiene hotel, abrir el flujo de creación
          this.isSpinnerVisible = false;
          this.openAddHotelModal();
          this.showNotification = true;
          this.message = 'Crea tu hotel';
          this.color = false;
          setTimeout(() => {
            this.showNotification = false;
          }, 3000);
        } else {
          console.error('Error al comprobar hotel del usuario:', error);
        }
      },
    );
  }

  openAddHotelModal(): void {
    const dialogRef = this.dialog.open(AddHotelComponent, {
      width: '600px',
      disableClose: true, // Evitar cerrar el modal sin completar
    });

    dialogRef.afterClosed().subscribe((hotel) => {
      if (hotel) {
        this.openAddRoomModal(hotel); // Abrir el modal de agregar habitaciones
      }
    });
  }

  openAddRoomModal(hotel: any): void {
    const dialogRef = this.dialog.open(AddRoomComponent, {
      width: '800px',
      disableClose: true, // Evitar cerrar el modal sin completar
      data: { hotel }, // Pasar el hotel creado
    });

    dialogRef.afterClosed().subscribe((habitaciones) => {
      if (habitaciones) {
        this.saveHotelAndRooms(hotel, habitaciones);
      }
    });
  }

  saveHotelAndRooms(hotel: any, habitaciones: any[]): void {
    const body = {
      hotel: hotel,
      habitaciones: habitaciones,
    };

    this.habitacionesService.crearHabitaciones(body).subscribe(
      (response) => {
        this.showNotification = true;
        this.message = 'Operación realizada con éxito';
        this.color = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      },
      (error) => {
        this.showNotification = true;
        this.message = 'Error al realizar la operación';
        this.color = false;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      },
    );
  }
}
