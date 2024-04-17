import { Component, OnInit } from '@angular/core';
import { Hotel } from '../interfaces/hotel.interface';
import { HotelesService } from '../services/hoteles.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss', './hotel-list.component.css']
})
export class HotelListComponent implements OnInit {

  isSpinnerVisible: boolean = true; // Agrega una variable para controlar la visibilidad del spinner
  public hoteles: Hotel[];
  public totalItems: number = 0;
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;

  public mostrarModalEliminar = false;
  public mostrarModalEditar = false;

  public idHotel: number; // ? cuando abro un modal actualizo este id para saber sobre que hotel ejecuto la accion
  public hotel: Hotel = { // ? cuando abro el modal editar actualizo este hotel para que me aparezcan los campos
    id: 0,
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    servicios: [],
    habitaciones: []
  };

  constructor(private hotelesService: HotelesService) { }

  ngOnInit(): void {
    this.hotelesService.getAllHotelesMagicFilter(this.pageNumber, this.itemsPerPage).subscribe(response => {
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
    this.hotelesService.getHotelesFilteredByQuery(value, this.pageNumber, this.itemsPerPage).subscribe(response => {
      this.hoteles = response.hoteles;
      this.totalItems = response.totalItems;
      this.query = value;
      this.isSpinnerVisible = false;
    });
  }

  onPageChange(value: number) {
    this.isSpinnerVisible = true;
    this.hotelesService.getHotelesFilteredByQuery(this.query, value, this.itemsPerPage).subscribe(response => {
      this.hoteles = response.hoteles;
      this.totalItems = response.totalItems;
      this.isSpinnerVisible = false;
    });
  }

  onItemPerPageChange(value: number) {
    this.isSpinnerVisible = true
    this.itemsPerPage = value; // Para que me actualice el valor que por defecto tengo a 5
    this.hotelesService.getHotelesFilteredByQuery(this.query, this.pageNumber, value).subscribe(response => {
      this.hoteles = response.hoteles;
      this.totalItems = response.totalItems;
      this.isSpinnerVisible = false;
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

  editHotel() {
    this.hotelesService.editHotel(this.idHotel, this.hotel).subscribe(response => {
      console.log("El hotel se editó correctamente")
      this.hotel = {
        id: 0,
        nombre: '',
        direccion: '',
        telefono: '',
        email: '',
        sitioWeb: '',
        servicios: [],
        habitaciones: []
      };
      this.ocultarModalEditarHotel();
      window.location.reload(); // ? Recargo la pagina para mostrar los cambios
    },
    error => {
      console.error(`Error al editar el hotel` + error)
    }
    )
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
    this.hotelesService.getHotelFull(idHotel).subscribe(data => {
      this.hotel = data;
    },
    error => {
      console.log("Error al obtener el hotel: " + error);
    }
  );
    this.mostrarModalEditar = true;
  }

  ocultarModalEditarHotel() {
    this.mostrarModalEditar = false;
    this.hotel = null;
  }

  onFloatingButtonClick() {
    console.log("pulso el boton")
  }


}
