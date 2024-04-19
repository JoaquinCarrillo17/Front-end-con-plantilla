import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
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

  @Output() cancelarCrear: EventEmitter<void> = new EventEmitter<void>(); // Para cerrar el modal con el boton de cancelar

  @ViewChild('numeroInput') numeroInput: { nativeElement: { value: number; }; };
  @ViewChild('tipoSelect') tipoSelect: { nativeElement: { value: string; }; };
  @ViewChild('precioInput') precioInput: { nativeElement: { value: number; }; };
  @ViewChild('hotelSelect') hotelSelect: { nativeElement: { value: number; }; };
  @ViewChild('nombreHuesped') nombreHuesped: { nativeElement: { value: string; }; };
  @ViewChild('dniHuesped') dniHuesped: { nativeElement: { value: string; }; };
  @ViewChild('emailHuesped') emailHuesped: { nativeElement: { value: string; }; };
  @ViewChild('fechaEntrada') fechaEntrada: { nativeElement: { value: string; }; };
  @ViewChild('fechaSalida') fechaSalida: { nativeElement: { value: string; }; };


  public hoteles: Hotel[];
  public habitacion: Habitacion = {
    numero: 0,
    tipoHabitacion: null,
    precioNoche: 0,
    huespedes: [],
  }

  constructor(private hotelesService: HotelesService) { }

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
      huespedes: this.habitacion.huespedes,
    };

    this.hotelesService.addHabitacion(idHotel, habitacion).subscribe(
      response => {
        console.log('Habitación añadida con éxito:', response);
        window.location.reload();
      },
      error => {
        console.error('Error al añadir habitación:', error);
      }
    );
  }

  agregarHuesped() {
    const nombre = this.nombreHuesped.nativeElement.value;
    const dni = this.dniHuesped.nativeElement.value;
    const email = this.emailHuesped.nativeElement.value;
    const fechaEntrada = this.fechaEntrada.nativeElement.value;
    const fechaSalida = this.fechaSalida.nativeElement.value;

    this.habitacion.huespedes.push({
      nombreCompleto: nombre,
      dni: dni,
      email: email,
      fechaCheckIn: new Date(fechaEntrada),
      fechaCheckOut: new Date(fechaSalida),
    })

    this.nombreHuesped.nativeElement.value = '';
    this.dniHuesped.nativeElement.value = '';
    this.emailHuesped.nativeElement.value = '';
    this.fechaEntrada.nativeElement.value = '';
    this.fechaSalida.nativeElement.value = '';

    this.ocultarFormularioHuesped();

  }

  // * Para el comportamiento de los forms del servicio y habitacion

  mostrarFormularioHuesped() {
    const formularioServicio = document.getElementById('formulario-huesped');
    formularioServicio.classList.add('mostrar');
  }

  ocultarFormularioHuesped() {
    const formularioServicio = document.getElementById('formulario-huesped');
    formularioServicio.classList.remove('mostrar');
  }

  ocultarModalEditarHabitacion() {
    this.cancelarCrear.emit();
  }

}
