import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Habitacion } from '../interfaces/habitacion.interface';
import { HabitacionesService } from '../services/habitaciones.service';
import { AddRoomComponent } from '../add-room/add-room.component';
import { EditRoomComponent } from '../edit-room/edit-room.component';
import { TokenService } from '../../token/token.service';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [SharedModule, AddRoomComponent, EditRoomComponent],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss'
})
export class RoomListComponent implements OnInit {

  isSpinnerVisible: boolean = true;
  public habitaciones: any[];
  public totalItems: number = 0;
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;
  public valueSortOrder: string = 'ASC';
  public sortBy: string = 'id';

  public mostrarModalEliminar = false;
  public mostrarModalEditarCrear = false;
  accionModal: 'editar' | 'crear' = 'editar';

  public puedeCrear: boolean;
  public idHabitacion: number;
  public usuario: any;
  public esSuperAdmin: boolean;

  constructor(private habitacionesService: HabitacionesService, private tokenService: TokenService) { }

  ngOnInit(): void {
    this.query = "";
    this.usuario = localStorage.getItem("usuario");
    this.esSuperAdmin = localStorage.getItem("superadmin") === "true";
    this.getHabitaciones(this.query);
    this.puedeCrear = this.tokenService.getRoles().includes('ROLE_HABITACIONES_W');
  }

  getHabitaciones(value: any): void {
    this.habitacionesService.getHabitacionesDynamicFilterOr(this.getDataForRequest(value)).subscribe(response => {
      this.habitaciones = response.content;
      this.totalItems = response.totalElements;
      this.isSpinnerVisible = false;
    },
    (error) => {
      if (error.status === 404) {
        this.habitaciones = [];
        this.totalItems = 0;
      }
      this.isSpinnerVisible = false;
    });
  }

  private getDataForRequest(value: any): any {
    const validServices = ['COCINA', 'TERRAZA', 'JACUZZI'];
    const validRoom = ['INDIVIDUAL', 'DOBLE', 'CUADRUPLE', 'SUITE'];

    let listSearchCriteria: any[] = [];

    // Filtros dinámicos
    if (value !== "" && value !== null) {
      if (!isNaN(value)) {
        listSearchCriteria.push({
          key: "id",
          operation: "equals",
          value: parseInt(value, 10)
        });
      }

      listSearchCriteria.push(
        {
          key: "numero",
          operation: "equals",
          value: value
        },
        {
          key: "hotel.nombre",
          operation: "contains",
          value: value
        }
        );

      if (!isNaN(value)) {
        listSearchCriteria.push({
          key: "precioNoche",
          operation: "equals",
          value: parseFloat(value)
        });
      }

      // Filtrar por servicios válidos
      if (validServices.includes(value.toUpperCase())) {
        listSearchCriteria.push({
          key: "servicios",
          operation: "equals",
          value: value.toUpperCase()
        });
      }
      if (validRoom.includes(value.toUpperCase())) {
        listSearchCriteria.push({
          key: "tipoHabitacion",
          operation: "equals",
          value: value.toUpperCase()
        });
      }
    }

    // Si no es superadmin, añadir filtro idUsuario
    if (!this.esSuperAdmin) {
      listSearchCriteria.push({
        key: "hotel.idUsuario",
        operation: "equals",
        value: this.usuario
      });
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

  search(value: string): void {
    this.isSpinnerVisible = true;
    this.getHabitaciones(value);
    this.query = value;
  }

  order(columnName: string): void {
    let direction = 'ASC';
    if (this.sortBy === columnName) {
      direction = this.valueSortOrder === 'ASC' ? 'DESC' : 'ASC';
    }
    this.sortBy = columnName;
    this.valueSortOrder = direction;
    this.getHabitaciones(this.query);
  }

  onPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.pageNumber = value;
    this.getHabitaciones(this.query);
  }

  onItemPerPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.itemsPerPage = value;
    this.getHabitaciones(this.query);
  }

  deleteHabitacion() {
    this.habitacionesService.deleteHabitacion(this.idHabitacion).subscribe(response => {
      window.location.reload(); // ? Recargo la pagina para mostrar los cambios
    },
    error => {
      console.error(`Error al eliminar la habitación ${this.idHabitacion}`, error);
    }
  )
  this.ocultarModalEliminarHabitacion();
  }

  // ? Gestion de los modales
  mostrarModalEliminarHabitacion(idHabitacion: number) {
    this.idHabitacion = idHabitacion;
    this.mostrarModalEliminar = true;
  }

  ocultarModalEliminarHabitacion() {
    this.mostrarModalEliminar = false;
  }

  mostrarModalEditarHabitacion(idHabitacion: number) {
    this.idHabitacion = idHabitacion;
    this.mostrarModalEditarCrear = true;
    this.accionModal = 'editar';
  }

  ocultarModalEditarHabitacion() {
    this.mostrarModalEditarCrear = false;
  }

  onFloatingButtonClick() {
    console.log("pulso el boton")
    this.mostrarModalEditarCrear = true;
    this.accionModal = 'crear'
  }


}
