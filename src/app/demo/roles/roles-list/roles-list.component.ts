import { Component, OnInit } from '@angular/core';
import { RolesService } from '../services/roles.service';
import { Rol } from '../interfaces/rol.interface';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { EditRolesComponent } from "../edit-roles/edit-roles.component";
import { AddRolesComponent } from "../add-roles/add-roles.component";

@Component({
    selector: 'app-roles-list',
    standalone: true,
    templateUrl: './roles-list.component.html',
    styleUrl: './roles-list.component.scss',
    imports: [SharedModule, EditRolesComponent, AddRolesComponent]
})
export class RolesListComponent implements OnInit {

  isSpinnerVisible: boolean = true;
  public roles: Rol[];
  public totalItems: number = 0;
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;
  public valueSortOrder: string = 'ASC';
  public sortBy: string = 'id';

  public mostrarModalEliminar = false;
  public mostrarModalEditarCrear = false;
  accionModal: 'editar' | 'crear' = 'editar';

  public showBorrarRolNotification = false;
  public showBorrarRolErrorNotification = false;

  public idRol: number; // ? Para saber que rol tiene que ser editado/creado

  constructor(private rolesService: RolesService) { }

  ngOnInit(): void {
    this.rolesService.getAllRolesMagicFilter().subscribe(response => {
      this.roles = response.roles;
      this.totalItems = response.totalItems;
      this.isSpinnerVisible = false;
    },
      (error) => {
        console.error('Error al cargar los roles: ' + error);
        this.isSpinnerVisible = false;
      }
    )
  }

  search(value: string): void {
    this.isSpinnerVisible = true;
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

  // ? Editar/crear/borrar rol

  deleteRol(){
    this.rolesService.deleteRol(this.idRol).subscribe(response => {
      this.showBorrarRolNotification = true;
      setTimeout(() => {
        this.showBorrarRolNotification = false;
      }, 3000);
      window.location.reload();
    }, error => {
      this.showBorrarRolErrorNotification = true;
      setTimeout(() => {
        this.showBorrarRolErrorNotification = false;
      }, 3000);
    })
  }

  mostrarModalEditarCrearRol(idRol: number) {
    this.idRol = idRol;
    this.mostrarModalEditarCrear = true;
    this.accionModal = 'editar';
  }

  ocultarModalEditarCrearRol() {
    this.mostrarModalEditarCrear = false;
  }

  mostrarModalEliminarRol(idRol: number) {
    this.idRol = idRol;
    this.mostrarModalEliminar = true;
  }

  ocultarModalEliminarRol() {
    this.mostrarModalEliminar = false;
  }

  onFloatingButtonClick() {
    this.mostrarModalEditarCrear = true;
    this.accionModal = 'crear'
  }

}
