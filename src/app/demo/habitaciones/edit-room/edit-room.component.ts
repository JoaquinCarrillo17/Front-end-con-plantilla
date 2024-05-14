import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HabitacionesService } from '../services/habitaciones.service';
import { Habitacion } from '../interfaces/habitacion.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-edit-room',
  standalone: true,
  imports: [FormsModule, CommonModule, SharedModule],
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.scss'
})
export class EditRoomComponent {

  @Input() idHabitacion: number;
  @Output() editComplete: EventEmitter<void> = new EventEmitter<void>();
  public habitacion: Habitacion = { // ? cuando abro el modal editar actualizo este habitacion para que me aparezcan los campos
    id: 0,
    numero: 0,
    tipoHabitacion: null,
    precioNoche: 0,
    huespedes: [],
  };

  public showEditarHabitacionNotification = false;
  public showEditarHabitacionErrorNotification = false;

  constructor(private habitacionesService: HabitacionesService) { }

  ngOnInit(): void {
    this.habitacionesService.getHabitacionFull(this.idHabitacion).subscribe(data => {
      this.habitacion = data;
    },
      error => {
        console.log("Error al obtener la habitacion: " + error);
      }
    );
  }

  editHabitacion() {
    this.habitacionesService.editHabitacion(this.idHabitacion, this.habitacion).subscribe(response => {
      console.log("La habitacion se editó correctamente")
      this.habitacion = {
        id: 0,
        numero: 0,
        tipoHabitacion: null,
        precioNoche: 0,
        huespedes: [],
      };
      this.ocultarModalEditarHabitacion();
      this.showEditarHabitacionNotification = true; // Mostrar la notificación
        setTimeout(() => {
        this.showEditarHabitacionNotification = false; // Ocultar la notificación después de 2 segundos
      }, 3000);
    },
      error => {
        this.showEditarHabitacionErrorNotification = true; // Mostrar la notificación
        setTimeout(() => {
        this.showEditarHabitacionErrorNotification = false; // Ocultar la notificación después de 2 segundos
      }, 3000);
      }
    )
  }

  ocultarModalEditarHabitacion() {
    this.editComplete.emit();
  }

}
