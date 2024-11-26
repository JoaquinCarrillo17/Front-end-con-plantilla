import { Component, OnInit } from '@angular/core';
import { Hotel } from '../interfaces/hotel.interface';
import { HotelesService } from '../services/hoteles.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AddHotelComponent } from '../add-hotel/add-hotel.component';
import { EditHotelComponent } from '../edit-hotel/edit-hotel.component';
import { TokenService } from '../../token/token.service';
import { MatDialog } from '@angular/material/dialog';
import { AddRoomComponent } from '../../habitaciones/add-room/add-room.component';
import { HabitacionesService } from '../../habitaciones/services/habitaciones.service';
import { ConfirmDialogComponent } from 'src/app/theme/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss', './hotel-list.component.css'],
  imports: [CommonModule, SharedModule],
})
export class HotelListComponent implements OnInit {
  mostrarAddRoomModal = false;
  hotelSeleccionado: any;

  isSpinnerVisible: boolean = true; // Agrega una variable para controlar la visibilidad del spinner
  public hoteles: any[];
  public totalItems: number = 0; // Para el pagination component
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;
  public valueSortOrder: string = 'ASC';
  public sortBy: string = 'id';

  showNotification: boolean = false;
  message: any;
  color: boolean = false;

  public puedeCrear: boolean; // ? Para saber si tengo rol y mostrar las acciones

  public usuario;
  public esSuperAdmin: any;

  constructor(
    private hotelesService: HotelesService,
    private tokenService: TokenService,
    private dialog: MatDialog,
    private habitacionesService: HabitacionesService,
  ) {}

  ngOnInit(): void {
    this.query = '';
    //this.puedeCrear = this.tokenService.getRoles().includes('ROLE_HOTELES_W');
    this.usuario = localStorage.getItem('usuario');
    this.esSuperAdmin =
      localStorage.getItem('superadmin') == 'true' ? true : false;
    this.comprobarHotelUsuario();
  }

  comprobarHotelUsuario(): void {
    this.hotelesService.getHotelPorUsuario(this.usuario).subscribe(
      (response) => {
        // Si el usuario tiene un hotel, se carga la lista de hoteles
        this.getHoteles(this.query);
      },
      (error) => {
        if (error.status === 404) {
          // Si no tiene hotel, abrir el flujo de creación
          this.isSpinnerVisible = false;
          this.openAddHotelModal();
        } else {
          console.error('Error al comprobar hotel del usuario:', error);
        }
      },
    );
  }

  getHoteles(value: any) {
    this.hotelesService
      .getHotelesDynamicFilterOr(this.getDataForRequest(value))
      .subscribe(
        (response) => {
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
        },
      );
  }

  private getDataForRequest(value: any): any {
    const validServices = [
      'GIMNASIO',
      'LAVANDERIA',
      'BAR',
      'CASINO',
      'KARAOKE',
      'MASCOTA',
      'PISCINA',
      'PARKING',
    ];

    // Inicializar la lista de criterios de búsqueda
    let listSearchCriteria: any[] = [];

    // Añadir filtros dinámicos
    if (value !== '' && value !== null) {
      // Añadir id al filtro solo si value es un número
      if (!isNaN(value)) {
        listSearchCriteria.push({
          key: 'id',
          operation: 'equals',
          value: parseInt(value, 10),
        });
      }

      listSearchCriteria.push(
        {
          key: 'nombre',
          operation: 'contains',
          value: value,
        },
        {
          key: 'direccion',
          operation: 'contains',
          value: value,
        },
      );

      // Añadir telefono al filtro solo si value es un número
      if (!isNaN(value)) {
        listSearchCriteria.push({
          key: 'telefono',
          operation: 'equals',
          value: parseInt(value, 10),
        });
      }

      listSearchCriteria.push(
        {
          key: 'email',
          operation: 'contains',
          value: value,
        },
        {
          key: 'sitioWeb',
          operation: 'contains',
          value: value,
        },
        {
          key: 'ubicacion.ciudad',
          operation: 'contains',
          value: value,
        },
        {
          key: 'ubicacion.pais',
          operation: 'contains',
          value: value,
        },
      );

      // Añadir servicios al filtro solo si value coincide con uno de los valores válidos
      if (validServices.includes(value.toUpperCase())) {
        listSearchCriteria.push({
          key: 'servicios',
          operation: 'equals',
          value: value.toUpperCase(),
        });
      }
    }

    // Si no es superadmin, añadir el filtro idUsuario
    if (!this.esSuperAdmin) {
      listSearchCriteria.push({
        key: 'idUsuario',
        operation: 'equals',
        value: this.usuario,
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

  search(value: string) {
    this.isSpinnerVisible = true;
    this.pageNumber = 0; // Para que me muestre la primera página al buscar
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
    this.getHoteles(this.query);
  }

  onPageChange(value: number) {
    this.isSpinnerVisible = true;
    this.pageNumber = value;
    this.getHoteles(this.query);
  }

  onItemPerPageChange(value: number) {
    this.isSpinnerVisible = true;
    this.itemsPerPage = value; // Para que me actualice el valor que por defecto tengo a 5
    this.getHoteles(this.query);
  }

  // Método para confirmar y eliminar un hotel
  confirmDeleteHotel(hotelId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Hotel',
        message: '¿Estás seguro de que quieres eliminar este hotel?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteHotel(hotelId);
      }
    });
  }

  // Método para eliminar un hotel
  deleteHotel(id: number): void {
    this.hotelesService.deleteHotel(id).subscribe(
      () => {
        this.showNotification = true;
        this.message = 'Operación realizada con éxito';
        this.color = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
        this.getHoteles(this.query); // Refresca la lista de hoteles
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

  openEditHotelModal(hotel: any): void {
    const dialogRef = this.dialog.open(EditHotelComponent, {
      width: '600px',
      data: { hotel }, // Pasar el objeto completo en lugar del ID
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.id = hotel.id;
        result.foto = hotel.foto;
        result.idUsuario = hotel.idUsuario;

        const ubicacion = {
          ciudad: result.ciudad,
          pais: result.pais,
          continente: result.continente,
        };

        result.ubicacion = ubicacion;
        delete result.ciudad;
        delete result.pais;
        delete result.continente;
        this.hotelesService.editHotel(hotel.id, result).subscribe(
          () => {
            this.showNotification = true;
            this.message = 'Operación realizada con éxito';
            this.color = true;
            setTimeout(() => {
              this.showNotification = false;
            }, 3000);
            this.getHoteles(this.query); // Refresca la lista
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

  openAddHotelModal(): void {
    const dialogRef = this.dialog.open(AddHotelComponent, {
      width: '600px',
      disableClose: true, // Evitar cerrar el modal sin completar
    });

    dialogRef.afterClosed().subscribe((hotel) => {
      if (hotel) {
        this.openAddRoomModal(hotel); // Abrir el modal de agregar habitaciones
      }
    });
  }

  openAddRoomModal(hotel: any): void {
    const dialogRef = this.dialog.open(AddRoomComponent, {
      width: '800px',
      disableClose: true, // Evitar cerrar el modal sin completar
      data: { hotel }, // Pasar el hotel creado
    });

    dialogRef.afterClosed().subscribe((habitaciones) => {
      if (habitaciones) {
        this.saveHotelAndRooms(hotel, habitaciones);
      }
    });
  }

  saveHotelAndRooms(hotel: any, habitaciones: any[]): void {
    // Realizar el POST del hotel y las habitaciones
    this.hotelesService.addHotel(hotel).subscribe(
      (hotelResponse) => {
        habitaciones.forEach((habitacion) => {
          habitacion.hotel = hotelResponse; // Asociar el hotel creado a las habitaciones
          this.habitacionesService.crearHabitacion(habitacion).subscribe(
            () => {
              this.showNotification = true;
              this.message = 'Operación realizada con éxito';
              this.color = true;
              setTimeout(() => {
                this.showNotification = false;
              }, 3000);
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
        });
        // Recargar la lista de hoteles
        this.getHoteles(this.query);
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
}
