import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ServiciosService } from '../services/servicios.service';
import { Servicio } from '../interfaces/servicio.interface';
import { AddServiceComponent } from '../add-service/add-service.component';
import { EditServiceComponent } from '../edit-service/edit-service.component';
import { TokenService } from '../../token/token.service';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [SharedModule, AddServiceComponent, EditServiceComponent],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss'
})
export class ServiceListComponent implements OnInit {

  isSpinnerVisible: boolean = true;
  public servicios: Servicio[];
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

  public idServicio: number; // ? cuando abro un modal actualizo este id para saber sobre que Servicio ejecuto la accion

  constructor(private serviciosService: ServiciosService, private tokenService: TokenService) { }

  ngOnInit(): void {
    this.serviciosService.getAllServiciosMagicFilter()
      .subscribe(response => {
        this.servicios = response.servicios;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      },
      (error) => {
        console.error('Error al cargar los servicios:', error);
        this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
      });

    this.puedeCrear = this.tokenService.getRoles().includes('ROLE_SERVICIOS_W');
  }

  search(value: string): void {
    this.isSpinnerVisible = true;
    this.serviciosService.getServiciosFilteredByQuery(value, this.valueSortOrder, this.sortBy, this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.servicios = response.servicios;
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
    this.serviciosService.getServiciosFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, this.pageNumber, this.itemsPerPage).subscribe(response => {
      this.servicios = response.servicios;
      this.totalItems = response.totalItems;
    });
  }

  onPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.serviciosService.getServiciosFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, value, this.itemsPerPage)
      .subscribe(response => {
        this.servicios = response.servicios;
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
    this.serviciosService.getServiciosFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, this.pageNumber, value)
      .subscribe(response => {
        this.servicios = response.servicios;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      },
      (error) => {
        console.error('Error al cargar los huespedes:', error);
        this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
      });
  }

  deleteServicio() {
    this.serviciosService.deleteServicio(this.idServicio).subscribe(response => {
      window.location.reload(); // ? Recargo la pagina para mostrar los cambios
    },
    error => {
      console.error(`Error al eliminar el servicio ${this.idServicio}`, error);
    }
  )
  this.ocultarModalEliminarServicio();
  }

  // ? Gestion de los modales
  mostrarModalEliminarServicio(idServicio: number) {
    this.idServicio = idServicio;
    this.mostrarModalEliminar = true;
  }

  ocultarModalEliminarServicio() {
    this.mostrarModalEliminar = false;
  }

  mostrarModalEditarServicio(idServicio: number) {
    this.idServicio = idServicio;
    this.mostrarModalEditarCrear = true;
    this.accionModal = 'editar';
  }

  ocultarModalEditarServicio() {
    this.mostrarModalEditarCrear = false;
  }

  onFloatingButtonClick() {
    console.log("pulso el boton")
    this.mostrarModalEditarCrear = true;
    this.accionModal = 'crear'
  }

}
