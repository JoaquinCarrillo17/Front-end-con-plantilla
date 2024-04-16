import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Huesped } from '../../huespedes/interfaces/huesped.interface';
import { HuespedesService } from '../../huespedes/services/huespedes.service';
import { Habitacion } from '../interfaces/habitacion.interface';
import { HabitacionesService } from '../services/habitaciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-link-room-guest',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './link-room-guest.component.html',
  styleUrl: './link-room-guest.component.scss'
})
export class LinkRoomGuestComponent {

  @ViewChild('nombreCompletoInput') nombreCompletoInput: { nativeElement: { value: string; }; };
  @ViewChild('dniInput') dniInput: { nativeElement: { value: string; }; };
  @ViewChild('emailInput') emailInput: { nativeElement: { value: string; }; };
  @ViewChild('fechaCheckInInput') fechaCheckInInput: { nativeElement: { value: string; }; };
  @ViewChild('fechaCheckOutInput') fechaCheckOutInput: { nativeElement: { value: string; }; };
  @ViewChild('habitacionSelect') habitacionSelect: { nativeElement: { value: number; }; };

  public habitaciones: Habitacion[];

  constructor(private habitacionesService: HabitacionesService, private router: Router) { }

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
        this.router.navigate(['/huespedes/list']);
      },
      error => {
        console.error('Error al añadir huésped:', error);
      }
    );
  }

}
