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
  public esSuperAdmin: any;

  constructor(private hotelesService: HotelesService, private tokenService: TokenService) { }

  ngOnInit(): void {
    this.query = "";
    //this.puedeCrear = this.tokenService.getRoles().includes('ROLE_HOTELES_W');
    this.usuario = localStorage.getItem("usuario");
    this.esSuperAdmin = localStorage.getItem("superadmin") == "true" ? true : false;
    this.getHoteles(this.query);
  }


  getHoteles(value: any) {
    this.hotelesService.getHotelesDynamicFilterOr(this.getDataForRequest(value)).subscribe(response => {
      this.hoteles = response.content;
      this.totalItems = response.totalElements;
      this.isSpinnerVisible = false;
    },
    (error) => {
      if (error.status === 404) {
        this.hoteles = [];
        this.totalItems = 0;
      }
      this.isSpinnerVisible = false;
    })
  }

  private getDataForRequest(value: any): any {
    const validServices = ['GIMNASIO', 'LAVANDERIA', 'BAR', 'CASINO', 'KARAOKE', 'MASCOTA', 'PISCINA', 'PARKING'];

    // Inicializar la lista de criterios de búsqueda
    let listSearchCriteria: any[] = [];

    // Añadir filtros dinámicos
    if (value !== "" && value !== null) {
      // Añadir id al filtro solo si value es un número
      if (!isNaN(value)) {
        listSearchCriteria.push({
          key: "id",
          operation: "equals",
          value: parseInt(value, 10)
        });
      }

      listSearchCriteria.push(
        {
          key: "nombre",
          operation: "contains",
          value: value
        },
        {
          key: "direccion",
          operation: "contains",
          value: value
        }
      );

      // Añadir telefono al filtro solo si value es un número
      if (!isNaN(value)) {
        listSearchCriteria.push({
          key: "telefono",
          operation: "equals",
          value: parseInt(value, 10)
        });
      }

      listSearchCriteria.push(
        {
          key: "email",
          operation: "contains",
          value: value
        },
        {
          key: "sitioWeb",
          operation: "contains",
          value: value
        },
        {
          key: "ubicacion.ciudad",
          operation: "contains",
          value: value
        },
        {
          key: "ubicacion.pais",
          operation: "contains",
          value: value
        }
      );

      // Añadir servicios al filtro solo si value coincide con uno de los valores válidos
      if (validServices.includes(value.toUpperCase())) {
        listSearchCriteria.push({
          key: "servicios",
          operation: "equals",
          value: value.toUpperCase()
        });
      }
    }

    // Si no es superadmin, añadir el filtro idUsuario
    if (!this.esSuperAdmin) {
      listSearchCriteria.push({
        key: "idUsuario",
        operation: "equals",
        value: this.usuario
      });
    }

    return {
      listOrderCriteria: {
        valueSortOrder: this.valueSortOrder,
        sortBy: this.sortBy
      },
      listSearchCriteria: listSearchCriteria,
      page: {
        pageIndex: this.pageNumber,
        pageSize: this.itemsPerPage
      }
    };
  }





  search(value: string) {
    this.isSpinnerVisible = true;
    this.getHoteles(value);
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
    this.getHoteles(this.query)
  }

  onPageChange(value: number) {
    this.isSpinnerVisible = true;
    this.pageNumber = value;
    this.getHoteles(this.query);
  }

  onItemPerPageChange(value: number) {
    this.isSpinnerVisible = true
    this.itemsPerPage = value; // Para que me actualice el valor que por defecto tengo a 5
    this.getHoteles(this.query)
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
