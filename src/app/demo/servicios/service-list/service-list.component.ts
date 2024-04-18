import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ServiciosService } from '../services/servicios.service';
import { Servicio } from '../interfaces/servicio.interface';
import { AddServiceComponent } from '../add-service/add-service.component';
import { EditServiceComponent } from '../edit-service/edit-service.component';

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

  public mostrarModalEliminar = false;
  public mostrarModalEditarCrear = false;
  accionModal: 'editar' | 'crear' = 'editar';

  public idServicio: number; // ? cuando abro un modal actualizo este id para saber sobre que Servicio ejecuto la accion

  constructor(private serviciosService: ServiciosService) { }

  ngOnInit(): void {
    this.serviciosService.getAllServicios(this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.servicios = response.servicios;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      });
  }

  search(value: string): void {
    this.isSpinnerVisible = true;
    this.serviciosService.getServiciosFilteredByQuery(value, this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.servicios = response.servicios;
        this.totalItems = response.totalItems;
        this.query = value;
        this.isSpinnerVisible = false;
      });
  }

  onPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.serviciosService.getServiciosFilteredByQuery(this.query, value, this.itemsPerPage)
      .subscribe(response => {
        this.servicios = response.servicios;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      });
  }

  onItemPerPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.serviciosService.getServiciosFilteredByQuery(this.query, this.pageNumber, value)
      .subscribe(response => {
        this.servicios = response.servicios;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
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
