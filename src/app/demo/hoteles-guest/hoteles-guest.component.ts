import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


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
    SharedModule,
    NgMultiSelectDropDownModule
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

  /*servicios = [
    { item_id: 1, item_text: 'GIMNASIO' },
    { item_id: 2, item_text: 'LAVANDERIA' },
    { item_id: 3, item_text: 'BAR' },
    { item_id: 4, item_text: 'CASINO' },
    { item_id: 5, item_text: 'KARAOKE' },
    { item_id: 6, item_text: 'PET FRIENDLY' },
    { item_id: 7, item_text: 'PISCINA' },
    { item_id: 8, item_text: 'PARKING' }
  ];*/

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Seleccionar todo',
    unSelectAllText: 'Deseleccionar todo',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

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
  filtroServicios: any[] = [];

  hotelId: any; // ? Voy a buscar las habitaciones de este hotel

  // Campos del modal
  modalCheckIn: any = null;
  modalCheckOut: any = null;
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
      if (params['checkIn']) {
        this.filtroCheckIn = params['checkIn'];
      }
      if (params['checkOut']) {
        this.filtroCheckOut = params['checkOut'];
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
      listSearchCriteria.push({ key: 'checkIn', operation: 'equals', value: this.filtroCheckIn });
    }
    if (this.filtroCheckOut) {
      listSearchCriteria.push({ key: 'checkOut', operation: 'equals', value: this.filtroCheckOut });
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
    this.modalCheckIn = this.filtroCheckIn ?? null;
    this.modalCheckOut = this.filtroCheckOut ?? null;
    this.modalOcupacion = '';
    this.modalServicios = this.filtroServicios ?? [];
  }

  goToHabitaciones() {
    const queryParams = {
      hotelId: this.hotelId,
      checkIn: this.modalCheckIn ? this.modalCheckIn : null, // Formatea la fecha a yyyy-MM-dd
      checkOut: this.modalCheckOut ? this.modalCheckOut : null,
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
