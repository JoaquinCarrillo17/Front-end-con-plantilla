import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Huesped } from '../interfaces/huesped.interface';
import { HuespedesService } from '../services/huespedes.service';
import { TokenService } from '../../token/token.service';
import { GuestModalComponent } from '../guest-modal/guest-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/theme/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.scss',
})
export class GuestListComponent implements OnInit {

  resetPagination: boolean = false;

  isSpinnerVisible: boolean = true;
  public huespedes: any[];
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
    private huespedesService: HuespedesService,
    private tokenService: TokenService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.query = '';
    this.usuario = localStorage.getItem('usuario');
    this.esSuperAdmin = localStorage.getItem('superadmin') === 'true';
    this.puedeCrear = this.tokenService.getRoles().includes('ROLE_HUESPEDES_W');

    this.getHuespedes(this.query);
  }

  private getDataForRequest(value: string): any {
    const listSearchCriteria: any[] = [];

    if (value) {
      listSearchCriteria.push(
        { key: 'nombreCompleto', operation: 'contains', value: value },
        { key: 'dni', operation: 'equals', value: value },
        { key: 'email', operation: 'contains', value: value },
      );

      if (!isNaN(Number(value))) {
        listSearchCriteria.push({
          key: 'id',
          operation: 'equals',
          value: parseInt(value, 10),
        });
      }
    }

    // Si no es superadmin, filtrar por idUsuario
    if (!this.esSuperAdmin) {
      listSearchCriteria.push({
        key: 'idUsuario',
        operation: 'equals',
        value: this.usuario
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

  getHuespedes(value: string): void {
    this.isSpinnerVisible = true;
    this.huespedesService
      .getHuespedesDynamicFilterOr(this.getDataForRequest(value))
      .subscribe(
        (response) => {
          this.huespedes = response.content;
          this.totalItems = response.totalElements;
          this.isSpinnerVisible = false;
        },
        (error) => {
          if (error.status === 404) {
            this.huespedes = [];
            this.totalItems = 0;
          }
          console.error('Error al cargar los huespedes:', error);
          this.isSpinnerVisible = false;
        },
      );
  }

  search(value: string): void {
    this.isSpinnerVisible = true;
    this.pageNumber = 0;

  // Forzar reset de la paginación
  this.resetPagination = true;
    this.getHuespedes(value);
    // Resetear la bandera después de ejecutar el método
  setTimeout(() => {
    this.resetPagination = false;
  }, 0);
    this.query = value;
  }

  order(columnName: string) {
    let direction = 'ASC';
    if (this.sortBy === columnName) {
      if (this.valueSortOrder === 'ASC') {
        direction = 'DESC';
      } else direction = 'ASC';
    }
    this.sortBy = columnName;
    this.valueSortOrder = direction;
    this.getHuespedes(this.query);
  }

  onPageChange(value: number): void {
    this.pageNumber = value;
    this.getHuespedes(this.query);
  }

  onItemPerPageChange(value: number): void {
    this.itemsPerPage = value;
    this.getHuespedes(this.query);
  }

  confirmDeleteHuesped(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Huésped',
        message: '¿Estás seguro de que quieres eliminar este huésped?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteHuesped(id);
      }
    });
  }

  deleteHuesped(id: number): void {
    this.huespedesService.deleteHuesped(id).subscribe(
      (response) => {
        this.showNotification = true;
        this.message = 'Operación realizada con éxito';
        this.color = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
        this.getHuespedes(this.query);
      },
      (error) => {
        this.showNotification = true;
        this.message = 'No puedes borrar un huésped que pertenece a una reserva';
        this.color = false;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      },
    );
  }

  onAddGuest(): void {
    const dialogRef = this.dialog.open(GuestModalComponent, {
      width: '500px',
      data: null, // No pasamos datos para crear
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.huespedesService.addHuesped(result).subscribe(
          () => {
            this.showNotification = true;
            this.message = 'Operación realizada con éxito';
            this.color = true;
            setTimeout(() => {
              this.showNotification = false;
            }, 3000);
            this.getHuespedes(this.query); // Refresca la lista
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
    });
  }

  onEditGuest(huesped: Huesped): void {
    const dialogRef = this.dialog.open(GuestModalComponent, {
      width: '500px',
      data: huesped, // Pasamos el huésped para editar
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.id = huesped.id;
        this.huespedesService.editHuesped(huesped.id, result).subscribe(
          () => {
            this.showNotification = true;
            this.message = 'Operación realizada con éxito';
            this.color = true;
            setTimeout(() => {
              this.showNotification = false;
            }, 3000);
            this.getHuespedes(this.query); // Refresca la lista
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
    });
  }
}
