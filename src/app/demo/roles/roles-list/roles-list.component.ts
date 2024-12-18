import { Component, OnInit } from '@angular/core';
import { RolesService } from '../services/roles.service';
import { Rol } from '../interfaces/rol.interface';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { EditRolesComponent } from "../edit-roles/edit-roles.component";
import { AddRolesComponent } from "../add-roles/add-roles.component";
import { TokenService } from '../../token/token.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/theme/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-roles-list',
    standalone: true,
    templateUrl: './roles-list.component.html',
    styleUrl: './roles-list.component.scss',
    imports: [SharedModule]
})
export class RolesListComponent implements OnInit {
  resetPagination: boolean = false;

  isSpinnerVisible: boolean = true;
  public roles: Rol[];
  public totalItems: number = 0;
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;
  public valueSortOrder: string = 'ASC';
  public sortBy: string = 'id';

  public puedeCrear: boolean;

  showNotification: boolean = false;
  message: any;
  color: boolean = false;

  constructor(
    private rolesService: RolesService,
    private tokenService: TokenService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.rolesService.getAllRolesMagicFilter().subscribe(
      (response) => {
        this.roles = response.roles;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      },
      (error) => {
        console.error('Error al cargar los roles:', error);
        this.isSpinnerVisible = false;
      }
    );
  }

  search(value: string): void {
    this.isSpinnerVisible = true;
    this.pageNumber = 0;

  // Forzar reset de la paginación
  this.resetPagination = true;
    this.rolesService.getRolesFilteredByQuery(value, this.valueSortOrder, this.sortBy, this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.roles = response.roles;
        this.totalItems = response.totalItems;
        this.query = value;
        this.isSpinnerVisible = false;
      },
      (error) => {
        console.error('Error al cargar los servicios:', error);
        this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
      });
      // Resetear la bandera después de ejecutar el método
  setTimeout(() => {
    this.resetPagination = false;
  }, 0);
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
    this.rolesService.getRolesFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, this.pageNumber, this.itemsPerPage).subscribe(response => {
      this.roles = response.roles;
      this.totalItems = response.totalItems;
    });
  }

  onPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.rolesService.getRolesFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, value, this.itemsPerPage)
      .subscribe(response => {
        this.roles = response.roles;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      },
      (error) => {
        console.error('Error al cargar los huespedes:', error);
        this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
      });
  }

  onItemPerPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.rolesService.getRolesFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, this.pageNumber, value)
      .subscribe(response => {
        this.roles = response.roles;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      },
      (error) => {
        console.error('Error al cargar los huespedes:', error);
        this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
      });
  }

  confirmDeleteRol(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Rol',
        message: '¿Estás seguro de que deseas eliminar este rol?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteRol(id);
      }
    });
  }

  deleteRol(id: number): void {
    this.rolesService.deleteRol(id).subscribe(
      () => {
        this.showNotification = true;
        this.message = 'Rol eliminado con éxito';
        this.color = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
        this.pageNumber = 0;
        this.cargarRoles();
      },
      (error) => {
        this.showNotification = true;
        this.message = 'Error al eliminar el rol';
        this.color = false;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      }
    );
  }

  abrirModalCrearRol(): void {
    const dialogRef = this.dialog.open(AddRolesComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((rol: Rol) => {
      if (rol) {
        this.rolesService.addRol(rol).subscribe(
          () => {
            this.showNotification = true;
            this.message = 'Operación realizada con éxito';
            this.color = true;
            setTimeout(() => {
              this.showNotification = false;
            }, 3000);
            this.cargarRoles(); // Recargar la lista de roles
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
    });
  }

  abrirModalEditarRol(rol: Rol): void {
    const dialogRef = this.dialog.open(EditRolesComponent, {
      width: '400px',
      data: { rol },
    });

    dialogRef.afterClosed().subscribe((updatedRol: Rol) => {
      if (updatedRol) {
        updatedRol.id = rol.id;
        this.rolesService.editRol(rol.id, updatedRol).subscribe(
          () => {
            this.showNotification = true;
            this.message = 'Operación realizada con éxito';
            this.color = true;
            setTimeout(() => {
              this.showNotification = false;
            }, 3000);
            this.cargarRoles(); // Recargar la lista de roles
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
    });
  }

}
