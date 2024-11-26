import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HabitacionesService } from '../services/habitaciones.service';
import { TokenService } from '../../token/token.service';
import { RoomModalComponent } from '../room-modal/room-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/theme/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss',
})
export class RoomListComponent implements OnInit {
  isSpinnerVisible: boolean = true;
  public habitaciones: any[];
  public habitacionSeleccionada: any = null;
  public totalItems: number = 0;
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;
  public valueSortOrder: string = 'ASC';
  public sortBy: string = 'id';

  public puedeCrear: boolean;
  public usuario: any;
  public esSuperAdmin: boolean;

  showNotification: boolean = false;
  message: any;
  color: boolean = false;

  constructor(
    private habitacionesService: HabitacionesService,
    private tokenService: TokenService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.query = '';
    this.usuario = localStorage.getItem('usuario');
    this.esSuperAdmin = localStorage.getItem('superadmin') === 'true';
    this.getHabitaciones(this.query);
    this.puedeCrear = this.tokenService
      .getRoles()
      .includes('ROLE_HABITACIONES_W');
  }

  getHabitaciones(value: any): void {
    this.habitacionesService
      .getHabitacionesDynamicFilterOr(this.getDataForRequest(value))
      .subscribe(
        (response) => {
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
        },
      );
  }

  private getDataForRequest(value: any): any {
    const validServices = ['COCINA', 'TERRAZA', 'JACUZZI'];
    const validRoom = ['INDIVIDUAL', 'DOBLE', 'TRIPLE', 'CUADRUPLE', 'SUITE'];

    let listSearchCriteria: any[] = [];

    // Filtros dinámicos
    if (value !== '' && value !== null) {
      if (!isNaN(value)) {
        listSearchCriteria.push({
          key: 'id',
          operation: 'equals',
          value: parseInt(value, 10),
        });
      }

      listSearchCriteria.push(
        {
          key: 'numero',
          operation: 'equals',
          value: value,
        },
        {
          key: 'hotel.nombre',
          operation: 'contains',
          value: value,
        },
      );

      if (!isNaN(value)) {
        listSearchCriteria.push({
          key: 'precioNoche',
          operation: 'equals',
          value: parseFloat(value),
        });
      }

      // Filtrar por servicios válidos
      if (validServices.includes(value.toUpperCase())) {
        listSearchCriteria.push({
          key: 'servicios',
          operation: 'equals',
          value: value.toUpperCase(),
        });
      }
      if (validRoom.includes(value.toUpperCase())) {
        listSearchCriteria.push({
          key: 'tipoHabitacion',
          operation: 'equals',
          value: value.toUpperCase(),
        });
      }
    }

    // Si no es superadmin, añadir filtro idUsuario
    if (!this.esSuperAdmin) {
      listSearchCriteria.push({
        key: 'hotel.idUsuario',
        operation: 'equals',
        value: this.usuario,
      });
    }

    return {
      listOrderCriteria: {
        valueSortOrder: this.valueSortOrder,
        sortBy: this.sortBy,
      },
      listSearchCriteria: listSearchCriteria,
      page: {
        pageIndex: this.pageNumber,
        pageSize: this.itemsPerPage,
      },
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

  confirmDeleteHabitacion(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Habitación',
        message: '¿Estás seguro de que quieres eliminar esta habitación?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteHabitacion(id);
      }
    });
  }

  deleteHabitacion(id: number): void {
    this.habitacionesService.deleteHabitacion(id).subscribe(
      () => {
        this.showNotification = true;
        this.message = 'Operación realizada con éxito';
        this.color = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
        this.getHabitaciones(this.query); // Refresca la lista
      },
      (error) => {
        this.showNotification = true;
        this.message = 'Error al realizar la operación';
        this.color = false;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      }
    );
  }

  toggleHabitacion(id: number): void {
    if (this.habitacionSeleccionada?.id === id) {
      this.habitacionSeleccionada = null; // Si es en la misma fila se cierra
    } else {
      this.habitacionesService.getHabitacion(id).subscribe((habitacion) => {
        this.habitacionSeleccionada = habitacion;
      });
    }
  }

  onFloatingButtonClick(): void {
    const dialogRef = this.dialog.open(RoomModalComponent, {
      width: '600px',
      data: null, // No se pasa habitación, es para crear
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.habitacionesService.crearHabitacion(result).subscribe(() => {
          this.showNotification = true;
          this.message = 'Operación realizada con éxito';
          this.color = true;
          setTimeout(() => {
            this.showNotification = false;
          }, 3000);
          this.getHabitaciones(this.query); // Refrescar la lista
        }, error => {
          this.showNotification = true;
          this.message = 'Error al realizar la operación';
          this.color = false;
          setTimeout(() => {
            this.showNotification = false;
          }, 3000);
        });
      }
    });
  }

  mostrarModalEditarHabitacion(habitacion: any): void {
    const dialogRef = this.dialog.open(RoomModalComponent, {
      width: '400px',
      data: habitacion, // Se pasa la habitación seleccionada para edición
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.id = habitacion.id;
        result.numero = habitacion.numero;
        result.hotel = habitacion.hotel;
        this.habitacionesService
          .editHabitacion(habitacion.id, result)
          .subscribe(() => {
            this.showNotification = true;
            this.message = 'Operación realizada con éxito';
            this.color = true;
            setTimeout(() => {
              this.showNotification = false;
            }, 3000);
            this.getHabitaciones(this.query); // Refrescar la lista
          }, error => {
            this.showNotification = true;
            this.message = 'Error al realizar la operación';
            this.color = false;
            setTimeout(() => {
              this.showNotification = false;
            }, 3000);
          });
      }
    });
  }
}
