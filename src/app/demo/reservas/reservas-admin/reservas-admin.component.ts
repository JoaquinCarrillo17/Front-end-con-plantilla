import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ReservasService } from '../reservas.service';
import { TokenService } from '../../token/token.service';
import { ConfirmDialogComponent } from 'src/app/theme/shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-reservas-admin',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './reservas-admin.component.html',
  styleUrl: './reservas-admin.component.scss'
})
export class ReservasAdminComponent implements OnInit {
  resetPagination: boolean = false;

  isSpinnerVisible: boolean = true;

  reservas: any[];

  public totalItems: number = 0;
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;
  public valueSortOrder: string = 'ASC';
  public sortBy: string = 'id';

  public usuario: any;
  public esSuperAdmin: boolean;
  public puedeCrear: boolean;

  showNotification: boolean = false;
  message: any;
  color: boolean = false;

  constructor(
    private tokenService: TokenService,
    private reservasService: ReservasService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.query = "";
    this.usuario = localStorage.getItem("usuario");
    this.esSuperAdmin = localStorage.getItem("superadmin") === "true";
    this.getReservas(this.query);
    this.puedeCrear = this.tokenService.getRoles().includes('ROLE_RESERVAS_W');
  }

  getReservas(value: any): void {
    this.reservasService.getReservasDynamicFilterOr(this.getDataForRequest(value)).subscribe(response => {
      this.reservas = response.content;
      this.totalItems = response.totalElements;
      this.isSpinnerVisible = false;
    },
    (error) => {
      if (error.status === 404) {
        this.reservas = [];
        this.totalItems = 0;
      }
      this.isSpinnerVisible = false;
    });
  }

  private getDataForRequest(value: any): any {

    const validRoom = ['INDIVIDUAL', 'DOBLE', 'TRIPLE', 'CUADRUPLE', 'SUITE'];

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
          key: "habitacion.numero",
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
          key: "coste",
          operation: "equals",
          value: parseFloat(value)
        });
      }

      if (validRoom.includes(value.toUpperCase())) {
        listSearchCriteria.push({
          key: "habitacion.tipoHabitacion",
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
    this.pageNumber = 0;

  // Forzar reset de la paginación
  this.resetPagination = true;
    this.getReservas(value);
    // Resetear la bandera después de ejecutar el método
  setTimeout(() => {
    this.resetPagination = false;
  }, 0);
    this.query = value;
  }

  order(columnName: string): void {
    let direction = 'ASC';
    if (this.sortBy === columnName) {
      direction = this.valueSortOrder === 'ASC' ? 'DESC' : 'ASC';
    }
    this.sortBy = columnName;
    this.valueSortOrder = direction;
    this.getReservas(this.query);
  }

  onPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.pageNumber = value;
    this.getReservas(this.query);
  }

  onItemPerPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.itemsPerPage = value;
    this.getReservas(this.query);
  }

  getNombresHuespedes(reserva: any): string {
    if (!reserva || !reserva.huespedes) {
      return '';
    }
    return reserva.huespedes.map(huesped => huesped?.nombreCompleto || 'Sin nombre').join(', ');
  }

  confirmDeleteReserva(id: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Reserva',
        message: '¿Estás seguro de que deseas eliminar esta reserva?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteReserva(id);
      }
    });
  }

  deleteReserva(id: any): void {
    this.reservasService.delete(id).subscribe(
      () => {
        this.showNotification = true;
        this.message = 'Reserva eliminada con éxito';
        this.color = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
        this.getReservas(this.query); // Refresca la lista de reservas
      },
      error => {
        this.showNotification = true;
        this.message = 'Error al eliminar la reserva';
        this.color = false;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      }
    );
  }

}
