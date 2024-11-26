import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TokenService } from '../token/token.service';
import { UbicacionService } from './ubicacion.service';
import { MatDialog } from '@angular/material/dialog';
import { UbicacionModalComponent } from './ubicacion-modal/ubicacion-modal.component';
import { ConfirmDialogComponent } from 'src/app/theme/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ubicacion',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './ubicacion.component.html',
  styleUrl: './ubicacion.component.scss',
})
export class UbicacionComponent implements OnInit {
  isSpinnerVisible: boolean = true;

  ubicaciones: any[];

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
    private dialog: MatDialog,
    private tokenService: TokenService,
    private ubicacionesService: UbicacionService,
  ) {}

  ngOnInit(): void {
    this.query = '';
    this.usuario = localStorage.getItem('usuario');
    this.esSuperAdmin = localStorage.getItem('superadmin') === 'true';
    this.getUbicaciones(this.query);
    this.puedeCrear = this.tokenService
      .getRoles()
      .includes('ROLE_UBICACIONES_W');
  }

  getUbicaciones(value: any): void {
    this.ubicacionesService
      .getUbicacionesDynamicFilterOr(this.getDataForRequest(value))
      .subscribe(
        (response) => {
          this.ubicaciones = response.content;
          this.totalItems = response.totalElements;
          this.isSpinnerVisible = false;
        },
        (error) => {
          if (error.status === 404) {
            this.ubicaciones = [];
            this.totalItems = 0;
          }
          this.isSpinnerVisible = false;
        },
      );
  }

  private getDataForRequest(value: any): any {
    let listSearchCriteria: any[] = [];

    // Filtros dinámicos
    if (value !== '' && value !== null) {
      listSearchCriteria.push({
        key: 'id',
        operation: 'equals',
        value: parseInt(value, 10),
      });

      listSearchCriteria.push({
        key: 'ciudad',
        operation: 'contains',
        value: value,
      });

      listSearchCriteria.push({
        key: 'continente',
        operation: 'contains',
        value: value,
      });

      listSearchCriteria.push({
        key: 'pais',
        operation: 'contains',
        value: value,
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
    this.getUbicaciones(value);
    this.query = value;
  }

  order(columnName: string): void {
    let direction = 'ASC';
    if (this.sortBy === columnName) {
      direction = this.valueSortOrder === 'ASC' ? 'DESC' : 'ASC';
    }
    this.sortBy = columnName;
    this.valueSortOrder = direction;
    this.getUbicaciones(this.query);
  }

  onPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.pageNumber = value;
    this.getUbicaciones(this.query);
  }

  onItemPerPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.itemsPerPage = value;
    this.getUbicaciones(this.query);
  }

  confirmDeleteUbicacion(id: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Ubicación',
        message: '¿Estás seguro de que deseas eliminar esta ubicación?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUbicacion(id);
      }
    });
  }

  deleteUbicacion(id: any): void {
    this.ubicacionesService.delete(id).subscribe(
      () => {
        this.showNotification = true;
        this.message = 'Operación realizada con éxito';
        this.color = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
        this.getUbicaciones(this.query); // Refresca la lista de ubicaciones
      },
      (error) => {
        this.showNotification = true;
        this.message = 'No puedes borrar una ubicación que tiene un hotel asociado';
        this.color = false;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      },
    );
  }

  onFloatingButtonClick(): void {
    const dialogRef = this.dialog.open(UbicacionModalComponent, {
      width: '400px',
      data: null, // No pasamos datos porque es para crear
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ubicacionesService.create(result).subscribe(
          () => {
            this.showNotification = true;
            this.message = 'Operación realizada con éxito';
            this.color = true;
            setTimeout(() => {
              this.showNotification = false;
            }, 3000);
            this.getUbicaciones(this.query); // Refresca la lista
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

  editUbicacion(ubicacion: any): void {
    const dialogRef = this.dialog.open(UbicacionModalComponent, {
      width: '400px',
      data: ubicacion, // Pasamos la ubicación para editar
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.id = ubicacion.id;
        this.ubicacionesService.update(ubicacion.id, result).subscribe(
          () => {
            this.showNotification = true;
            this.message = 'Operación realizada con éxito';
            this.color = true;
            setTimeout(() => {
              this.showNotification = false;
            }, 3000);
            this.getUbicaciones(this.query); // Refresca la lista
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
