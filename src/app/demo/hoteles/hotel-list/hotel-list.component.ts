import { Component, OnInit } from '@angular/core';
import { Hotel } from '../interfaces/hotel.interface';
import { HotelesService } from '../services/hoteles.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AddHotelComponent } from "../add-hotel/add-hotel.component";
import { EditHotelComponent } from '../edit-hotel/edit-hotel.component';

@Component({
    selector: 'app-hotel-list',
    standalone: true,
    templateUrl: './hotel-list.component.html',
    styleUrls: ['./hotel-list.component.scss', './hotel-list.component.css'],
    imports: [CommonModule, SharedModule, AddHotelComponent, EditHotelComponent]
})
export class HotelListComponent implements OnInit {

  isSpinnerVisible: boolean = true; // Agrega una variable para controlar la visibilidad del spinner
  public hoteles: Hotel[];
  public totalItems: number = 0; // Para el pagination component
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;
  public valueSortOrder: string = 'ASC';
  public sortBy: string = 'id';

  public mostrarModalEliminar = false;
  public mostrarModalEditarCrear = false;
  accionModal: 'editar' | 'crear' = 'editar';

  public idHotel: number; // ? cuando abro un modal actualizo este id para saber sobre que hotel ejecuto la accion

  constructor(private hotelesService: HotelesService) { }

  ngOnInit(): void {
    this.hotelesService.getAllHotelesMagicFilter().subscribe(response => {
      this.hoteles = response.hoteles;
      this.totalItems = response.totalItems;
      this.isSpinnerVisible = false;
    },
      (error) => {
        console.error('Error al cargar los hoteles:', error);
        this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
      }
    );
  }

  search(value: string) {
    this.isSpinnerVisible = true;
    this.hotelesService.getHotelesFilteredByQuery(value, this.valueSortOrder, this.sortBy, this.pageNumber, this.itemsPerPage).subscribe(response => {
      this.hoteles = response.hoteles;
      this.totalItems = response.totalItems;
      this.query = value;
      this.isSpinnerVisible = false;
    },
    (error) => {
      console.error('Error al cargar los hoteles:', error);
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
    this.hotelesService.getHotelesFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, this.pageNumber, this.itemsPerPage).subscribe(response => {
      this.hoteles = response.hoteles;
      this.totalItems = response.totalItems;
    });
  }

  onPageChange(value: number) {
    this.isSpinnerVisible = true;
    this.hotelesService.getHotelesFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, value, this.itemsPerPage).subscribe(response => {
      this.hoteles = response.hoteles;
      this.totalItems = response.totalItems;
      this.isSpinnerVisible = false;
    },
    (error) => {
      console.error('Error al cargar los hoteles:', error);
      this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
    });
  }

  onItemPerPageChange(value: number) {
    this.isSpinnerVisible = true
    this.itemsPerPage = value; // Para que me actualice el valor que por defecto tengo a 5
    this.hotelesService.getHotelesFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, this.pageNumber, value).subscribe(response => {
      this.hoteles = response.hoteles;
      this.totalItems = response.totalItems;
      this.isSpinnerVisible = false;
    },
    (error) => {
      console.error('Error al cargar los hoteles:', error);
      this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
    });
  }

  deleteHotel() {
    this.hotelesService.deleteHotel(this.idHotel).subscribe(response => {
      window.location.reload(); // ? Recargo la pagina para mostrar los cambios
    },
      error => {
        console.error(`Error al eliminar el hotel ${this.idHotel}`, error);
      }
    )
    this.ocultarModalEliminarHotel();
  }

  // ? Gestion de los modales
  mostrarModalEliminarHotel(idHotel: number) {
    this.idHotel = idHotel;
    this.mostrarModalEliminar = true;
  }

  ocultarModalEliminarHotel() {
    this.mostrarModalEliminar = false;
  }

  mostrarModalEditarHotel(idHotel: number) {
    this.idHotel = idHotel;
    this.mostrarModalEditarCrear = true;
    this.accionModal = 'editar';
  }

  ocultarModalEditarHotel() {
    this.mostrarModalEditarCrear = false;
  }

  onFloatingButtonClick() {
    this.mostrarModalEditarCrear = true;
    this.accionModal = 'crear'
  }


}
