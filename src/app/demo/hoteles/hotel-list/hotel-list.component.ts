import { Component, OnInit } from '@angular/core';
import { Hotel } from '../interfaces/hotel.interface';
import { HotelesService } from '../services/hoteles.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AddHotelComponent } from "../add-hotel/add-hotel.component";
import { EditHotelComponent } from '../edit-hotel/edit-hotel.component';
import { TokenService } from '../../token/token.service';

@Component({
    selector: 'app-hotel-list',
    standalone: true,
    templateUrl: './hotel-list.component.html',
    styleUrls: ['./hotel-list.component.scss', './hotel-list.component.css'],
    imports: [CommonModule, SharedModule, AddHotelComponent, EditHotelComponent]
})
export class HotelListComponent implements OnInit {

  isSpinnerVisible: boolean = true; // Agrega una variable para controlar la visibilidad del spinner
  public hoteles: any[];
  public totalItems: number = 0; // Para el pagination component
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;
  public valueSortOrder: string = 'ASC';
  public sortBy: string = 'id';

  public mostrarModalEliminar = false;
  public mostrarModalEditarCrear = false;
  accionModal: 'editar' | 'crear' = 'editar';

  public showBorrarHotelNotification = false;
  public showBorrarHotelErrorNotification = false;

  public puedeCrear: boolean; // ? Para saber si tengo rol y mostrar las acciones

  public idHotel: number; // ? cuando abro un modal actualizo este id para saber sobre que hotel ejecuto la accion
  public usuario;

  constructor(private hotelesService: HotelesService, private tokenService: TokenService) { }

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

    this.puedeCrear = this.tokenService.getRoles().includes('ROLE_HOTELES_W');
    this.usuario = localStorage.getItem("usuario");
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
      if (error.status === 404) {
        this.hoteles = [];
        this.totalItems = 0;
      }
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
      this.showBorrarHotelNotification = true;
      setTimeout(() => {
        this.showBorrarHotelNotification = false;
      }, 3000);
      window.location.reload(); // ? Recargo la pagina para mostrar los cambios
    },
      error => {
        this.showBorrarHotelErrorNotification = true;
      setTimeout(() => {
        this.showBorrarHotelErrorNotification = false;
      }, 3000);
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
