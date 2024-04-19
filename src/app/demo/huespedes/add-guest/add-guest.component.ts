import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Habitacion } from '../../habitaciones/interfaces/habitacion.interface';
import { HabitacionesService } from '../../habitaciones/services/habitaciones.service';
import { Huesped } from '../interfaces/huesped.interface';

@Component({
  selector: 'app-add-guest',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-guest.component.html',
  styleUrl: './add-guest.component.scss'
})
export class AddGuestComponent {

  @Output() cancelarCrear: EventEmitter<void> = new EventEmitter<void>(); // Para cerrar el modal con el boton de cancelar

  @ViewChild('nombreCompletoInput') nombreCompletoInput: { nativeElement: { value: string; }; };
  @ViewChild('dniInput') dniInput: { nativeElement: { value: string; }; };
  @ViewChild('emailInput') emailInput: { nativeElement: { value: string; }; };
  @ViewChild('fechaCheckInInput') fechaCheckInInput: { nativeElement: { value: string; }; };
  @ViewChild('fechaCheckOutInput') fechaCheckOutInput: { nativeElement: { value: string; }; };
  @ViewChild('habitacionSelect') habitacionSelect: { nativeElement: { value: number; }; };

  public habitaciones: Habitacion[];

  constructor(private habitacionesService: HabitacionesService) { }

  ngOnInit(): void {
    this.habitacionesService.getAllHabitaciones().subscribe(habitaciones => this.habitaciones = habitaciones);
  }

  onSubmit() {

    // ! EL REQUIRED SOLO FUNCIONA SI PONGO EL BOTON SUBMIT PERO SI HAGO ESTO NO PUEDO HACER EL ROUTER NI VER LOS PRINTS

    const nombreCompleto = this.nombreCompletoInput.nativeElement.value;
    const dni = this.dniInput.nativeElement.value;
    const email = this.emailInput.nativeElement.value;
    const fechaCheckIn = this.fechaCheckInInput.nativeElement.value;
    const fechaCheckOut = this.fechaCheckOutInput.nativeElement.value;
    const idHabitacion = this.habitacionSelect.nativeElement.value;

    // Llamar al servicio para crear el huésped con los datos recopilados
    const huesped: Huesped = {
      nombreCompleto: nombreCompleto,
      dni: dni,
      email: email,
      fechaCheckIn: new Date(fechaCheckIn),
      fechaCheckOut: new Date(fechaCheckOut),
    };

    this.habitacionesService.addHuesped(idHabitacion, huesped).subscribe(
      response => {
        console.log('Huésped añadido con éxito:', response);
        window.location.reload();
      },
      error => {
        console.error('Error al añadir huésped:', error);
      }
    );
  }

  ocultarModalEditarHuesped() {
    this.cancelarCrear.emit();
  }

}
