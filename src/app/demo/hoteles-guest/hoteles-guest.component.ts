import { Component, OnInit } from '@angular/core';
import { UbicacionService } from '../ubicacion/ubicacion.service';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { HotelesService } from '../hoteles/services/hoteles.service';
import { FormsModule } from '@angular/forms';
import { SharedModule } from "../../theme/shared/shared.module";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hoteles-guest',
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
  templateUrl: './hoteles-guest.component.html',
  styleUrls: ['./hoteles-guest.component.scss']
})
export class HotelesGuestComponent implements OnInit {

  continentes: string[] = [];
  paises: string[] = [];
  ciudades: string[] = [];
  servicios = [
    { key: 'GIMNASIO', value: 'GIMNASIO' },
    { key: 'LAVANDERIA', value: 'LAVANDERIA' },
    { key: 'BAR', value: 'BAR' },
    { key: 'CASINO', value: 'CASINO' },
    { key: 'KARAOKE', value: 'KARAOKE' },
    { key: 'PET FRIENDLY', value: 'MASCOTA' },
    { key: 'PISCINA', value: 'PISCINA' },
    { key: 'PARKING', value: 'PARKING' }
  ];

  /* Para recuperar los hoteles */
  hoteles = [];
  totalItems: number = 0;
  pageNumber: number = 0;
  itemsPerPage: number = 5;
  valueSortOrder: string = 'ASC';
  sortBy: string = 'id';
  isSpinnerVisible: boolean = true;

  // Valores para los filtros
  filtroContinente: string = '';
  filtroCiudad: string = '';
  filtroPais: string = '';
  filtroCheckIn: string = '';
  filtroCheckOut: string = '';
  filtroServicios: string[] = [];

  hotelId: any; // ? Voy a buscar las habitaciones de este hotel

  // Campos del modal
  modalCheckIn: Date | null = null;
  modalCheckOut: Date | null = null;
  modalOcupacion: string = '';
  modalServicios: string[] = [];
  precioMin: any;
  precioMax: any;

  constructor(
    private ubicacionesService: UbicacionService,
    private hotelesService: HotelesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.cargarUbicaciones();

    this.route.queryParams.subscribe(params => {
      if (params['ciudad']) {
        this.filtroCiudad = params['ciudad'];
      }
      if (params['servicio']) {
        this.filtroServicios = [params['servicio']];
      }
    });

    this.buscarHoteles();

  }

  cargarUbicaciones(): void {
    this.ubicacionesService.getAllUbicaciones().subscribe((ubicaciones: any[]) => {
      this.extraerValoresUnicos(ubicaciones);
    });
  }

  extraerValoresUnicos(ubicaciones: any[]): void {
    this.continentes = [...new Set(ubicaciones.map(ubicacion => String(ubicacion.continente)))];
    this.paises = [...new Set(ubicaciones.map(ubicacion => String(ubicacion.pais)))];
    this.ciudades = [...new Set(ubicaciones.map(ubicacion => String(ubicacion.ciudad)))];
  }

  getHoteles() {
    this.hotelesService.getHotelesDynamicFilterAnd(this.getDataForRequest()).subscribe(response => {
      this.hoteles = response.content;
      this.totalItems = response.totalElements;
      this.isSpinnerVisible = false;
    }, (error) => {
      if (error.status === 404) {
        this.hoteles = [];
        this.totalItems = 0;
      }
      this.isSpinnerVisible = false;
    });
  }

  private getDataForRequest(): any {
    let listSearchCriteria: any[] = [];

    // Añadir filtros específicos
    if (this.filtroContinente) {
      listSearchCriteria.push({ key: 'ubicacion.continente', operation: 'contains', value: this.filtroContinente });
    }
    if (this.filtroCiudad) {
      listSearchCriteria.push({ key: 'ubicacion.ciudad', operation: 'contains', value: this.filtroCiudad });
    }
    if (this.filtroPais) {
      listSearchCriteria.push({ key: 'ubicacion.pais', operation: 'contains', value: this.filtroPais });
    }
    if (this.filtroCheckIn) {
      listSearchCriteria.push({ key: 'fechaCheckIn', operation: 'greaterThanOrEqual', value: this.filtroCheckIn });
    }
    if (this.filtroCheckOut) {
      listSearchCriteria.push({ key: 'fechaCheckOut', operation: 'lessThanOrEqual', value: this.filtroCheckOut });
    }
    if (this.filtroServicios) {
      const serviciosConcatenados = this.filtroServicios
      .map(key => {
        const servicio = this.servicios.find(s => s.key === key);
        return servicio ? servicio.value : '';
      })
      .filter(value => value !== '') // Filtrar los valores vacíos, en caso de que no se encuentre algún servicio
      .join(';');

    // Añadir el criterio de búsqueda con los servicios concatenados
    if (serviciosConcatenados) {
      listSearchCriteria.push({ key: 'servicios', operation: 'equals', value: serviciosConcatenados });
    }
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

  // Método para actualizar filtros y buscar hoteles
  buscarHoteles() {
    this.isSpinnerVisible = true;
    this.getHoteles();
  }

  onPageChange(value: number) {
    this.isSpinnerVisible = true;
    this.pageNumber = value;
    this.getHoteles();
  }

  onItemPerPageChange(value: number) {
    this.isSpinnerVisible = true;
    this.itemsPerPage = value;
    this.getHoteles();
  }

  limpiarFiltros() {
    this.filtroCiudad = '';
    this.filtroPais = '';
    this.filtroCheckIn = '';
    this.filtroCheckOut = '';
    this.filtroServicios = [];
    this.buscarHoteles();
  }

  abrirModal(hotelId) {
    this.hotelId = hotelId;
    this.modalCheckIn = null;
    this.modalCheckOut = null;
    this.modalOcupacion = '';
    this.modalServicios = [];
  }

  goToHabitaciones() {
    console.log("Buscando habitaciones...");
    console.log("Hotel ID:", this.hotelId);
    console.log("Check-in:", this.modalCheckIn);
    console.log("Check-out:", this.modalCheckOut);
    console.log("Ocupación:", this.modalOcupacion);
    console.log("Servicios:", this.modalServicios);

    const queryParams = {
      hotelId: this.hotelId,
      checkIn: this.modalCheckIn ? this.modalCheckIn.toISOString().split('T')[0] : null, // Formatea la fecha a yyyy-MM-dd
      checkOut: this.modalCheckOut ? this.modalCheckOut.toISOString().split('T')[0] : null,
      ocupacion: this.modalOcupacion ? this.modalOcupacion : null,
      servicios: this.modalServicios.length > 0 ? this.modalServicios.join(';') : null,
      precioMin: this.precioMin !== 0 ? this.precioMin : null,
      precioMax: this.precioMax !== 1000 ? this.precioMax : null
    };

    this.router.navigate(['/habitaciones'], { queryParams });
  }

  onRangeChange(event: { min: number; max: number }): void {
    this.precioMin = event.min;
    this.precioMax = event.max;
  }
}
