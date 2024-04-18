import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Habitacion } from '../interfaces/habitacion.interface';
import { HabitacionesService } from '../services/habitaciones.service';
import { AddRoomComponent } from '../add-room/add-room.component';
import { EditRoomComponent } from '../edit-room/edit-room.component';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [SharedModule, AddRoomComponent, EditRoomComponent],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss'
})
export class RoomListComponent implements OnInit {

  isSpinnerVisible: boolean = true;
  public habitaciones: Habitacion[];
  public totalItems: number = 0;
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;

  public mostrarModalEliminar = false;
  public mostrarModalEditarCrear = false;
  accionModal: 'editar' | 'crear' = 'editar';

  public idHabitacion: number; // ? cuando abro un modal actualizo este id para saber sobre que habitacion ejecuto la accion

  constructor(private habitacionesService: HabitacionesService){ }

  ngOnInit(): void {
    this.habitacionesService.getAllHabitacionesMagicFilter(this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.habitaciones = response.habitaciones;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      });
  }

  search(value: string): void {
    this.isSpinnerVisible = true;
    this.habitacionesService.getHabitacionesFilteredByQuery(value, this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.habitaciones = response.habitaciones;
        this.totalItems = response.totalItems;
        this.query = value;
        this.isSpinnerVisible = false;
      });
  }

  onPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.habitacionesService.getHabitacionesFilteredByQuery(this.query, value, this.itemsPerPage)
      .subscribe(response => {
        this.habitaciones = response.habitaciones;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      });
  }

  onItemPerPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.habitacionesService.getHabitacionesFilteredByQuery(this.query, this.pageNumber, value)
      .subscribe(response => {
        this.habitaciones = response.habitaciones;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      });
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
