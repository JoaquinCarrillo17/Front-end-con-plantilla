import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitacionesService } from '../habitaciones/services/habitaciones.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-habitaciones-guest',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    CommonModule,
    FormsModule,
    SharedModule
  ],
  providers: [DatePipe],
  templateUrl: './habitaciones-guest.component.html',
  styleUrls: ['./habitaciones-guest.component.scss']
})
export class HabitacionesGuestComponent implements OnInit {

  isSpinnerVisible: boolean = true;

  precioMin: any;
  precioMax: any;

  ocupacionArray = [
    'INDIVIDUAL',
    'DOBLE',
    'TRIPLE',
    'CUADRUPLE',
    'SUITE',
  ];

  serviciosArray = [
    { key: 'COCINA', value: 'COCINA' },
    { key: 'TERRAZA', value: 'TERRAZA' },
    { key: 'JACUZZI', value: 'JACUZZI' },
  ];

  listSearchCriteria: any[] = [];

  habitaciones = [];
  totalItems: number = 0;
  pageNumber: number = 0;
  itemsPerPage: number = 5;
  valueSortOrder: string = 'ASC';
  sortBy: string = 'id';

  // Valores para los filtros basados en los parámetros de la URL
  hotelId: string = '';
  checkIn: string = '';
  checkOut: string = '';
  ocupacion: string = '';
  servicios: string[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private habitacionesService: HabitacionesService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    // Suscripción a los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      if (params['hotelId']) {
        this.hotelId = params['hotelId'];
      }
      if (params['checkIn']) {
        this.checkIn = params['checkIn'];
      }
      if (params['checkOut']) {
        this.checkOut = params['checkOut'];
      }
      if (params['ocupacion']) {
        this.ocupacion = params['ocupacion'];
      }
      if (params['servicios']) {
        this.servicios = params['servicios'].split(';');
      }
      if (params['precioMin']) {
        this.precioMin = params['precioMin'];
      }
      if (params['precioMax']) {
        this.precioMax = params['precioMax'];
      }
    });

    // Llamada al método para buscar habitaciones con los criterios obtenidos
    this.buscarHabitaciones();
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  buscarHabitaciones() {
    this.isSpinnerVisible = true;
    this.getHabitaciones();
  }

  getHabitaciones() {
    this.habitacionesService.getHabitacionesDynamicFilterAnd(this.getDataForRequest()).subscribe(response => {
      this.habitaciones = response.content;
      this.totalItems = response.totalElements;
      this.isSpinnerVisible = false;
    }, (error) => {
      if (error.status === 404) {
        this.habitaciones = [];
        this.totalItems = 0;
      }
      this.isSpinnerVisible = false;
    });
  }

  private getDataForRequest(): any {
    let listSearchCriteria: any[] = [];

    // Añadir filtros específicos
    if (this.hotelId) {
      listSearchCriteria.push({ key: 'hotel.id', operation: 'equals', value: this.hotelId });
    }
    if (this.checkIn) {
      listSearchCriteria.push({ key: 'fechaCheckIn', operation: 'greaterThanOrEqual', value: this.checkIn });
    }
    if (this.checkOut) {
      listSearchCriteria.push({ key: 'fechaCheckOut', operation: 'lessThanOrEqual', value: this.checkOut });
    }
    if (this.ocupacion) {
      listSearchCriteria.push({ key: 'tipoHabitacion', operation: 'equals', value: this.ocupacion });
    }
    if (this.servicios && this.servicios.length > 0) {
      const serviciosConcatenados = this.servicios
      .map(key => {
        const servicio = this.serviciosArray.find(s => s.key === key);
        return servicio ? servicio.value : '';
      })
      .filter(value => value !== '') // Filtrar los valores vacíos, en caso de que no se encuentre algún servicio
      .join(';');

      if (serviciosConcatenados) {
        listSearchCriteria.push({ key: 'servicios', operation: 'equals', value: serviciosConcatenados });
      }
    }
    if (this.precioMin) {
      listSearchCriteria.push({ key: 'precioNoche', operation: 'greaterThanOrEqual', value: this.precioMin });
    }
    if (this.precioMax) {
      listSearchCriteria.push({ key: 'precioNoche', operation: 'lessThanOrEqual', value: this.precioMax });
    }

    return {
      listOrderCriteria: {
        valueSortOrder: this.valueSortOrder,
        sortBy: this.sortBy
      },
      listSearchCriteria: listSearchCriteria,
      page: {
        pageIndex: this.pageNumber,
        pageSize: this.itemsPerPage
      }
    };
  }

  onPageChange(value: number) {
    this.isSpinnerVisible = true;
    this.pageNumber = value;
    this.getHabitaciones();
  }

  onItemPerPageChange(value: number) {
    this.isSpinnerVisible = true;
    this.itemsPerPage = value;
    this.getHabitaciones();
  }

  limpiarFiltros() {
    this.checkIn = '';
    this.checkOut = '';
    this.ocupacion = '';
    this.servicios = [];
    this.precioMin = 0;
    this.precioMax = 1000;
    this.buscarHabitaciones();
  }

  goToReservar(habitacionId) {
    this.router.navigate(['/resumen-reserva'], {
      queryParams: {
        habitacionId: habitacionId,
        checkIn: this.checkIn,
        checkOut: this.checkOut
      }
    });
  }

  onRangeChange(event: { min: number; max: number }): void {
    this.precioMin = event.min;
    this.precioMax = event.max;
    // Update your search criteria or form based on the new values
  }
}
