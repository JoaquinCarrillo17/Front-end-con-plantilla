import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Hotel } from '../../hoteles/interfaces/hotel.interface';
import { HotelesService } from '../../hoteles/services/hoteles.service';
import { TipoHabitacion, Habitacion } from '../interfaces/habitacion.interface';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-room.component.html',
  styleUrl: './add-room.component.scss'
})
export class AddRoomComponent {

  @ViewChild('numeroInput') numeroInput: { nativeElement: { value: number; }; };
  @ViewChild('tipoSelect') tipoSelect: { nativeElement: { value: string; }; };
  @ViewChild('precioInput') precioInput: { nativeElement: { value: number; }; };
  @ViewChild('hotelSelect') hotelSelect: { nativeElement: { value: number; }; };

  public hoteles: Hotel[];

  constructor(private hotelesService: HotelesService, private router: Router) { }

  ngOnInit(): void {
    this.hotelesService.getAllHoteles().subscribe(hoteles => this.hoteles = hoteles);
  }

  onSubmit() {

    // ! EL REQUIRED SOLO FUNCIONA SI PONGO EL BOTON SUBMIT PERO SI HAGO ESTO NO PUEDO HACER EL ROUTER NI VER LOS PRINTS

    const numero = this.numeroInput.nativeElement.value;
    const tipo = this.tipoSelect.nativeElement.value;
    const precio = this.precioInput.nativeElement.value;
    const idHotel = this.hotelSelect.nativeElement.value;

    let tipoHabitacion: TipoHabitacion;
    switch (tipo) {
      case "INDIVIDUAL":
        tipoHabitacion = TipoHabitacion.INDIVIDUAL;
        break;
      case "DOBLE":
        tipoHabitacion = TipoHabitacion.DOBLE;
        break;
      case "CUADRUPLE":
        tipoHabitacion = TipoHabitacion.CUADRUPLE;
        break;
      case "SUITE":
        tipoHabitacion = TipoHabitacion.SUITE;
        break;
      default:
        break;
    }

    const habitacion: Habitacion = {
      numero: numero,
      tipoHabitacion: tipoHabitacion,
      precioNoche: precio,
      huespedes: [],
    };

    this.hotelesService.addHabitacion(idHotel, habitacion).subscribe(
      response => {
        console.log('Habitación añadida con éxito:', response);
        this.router.navigate(['/habitaciones/list']);
      },
      error => {
        console.error('Error al añadir habitación:', error);
      }
    );
  }

}
