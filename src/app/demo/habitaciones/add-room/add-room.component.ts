import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { HotelesService } from '../../hoteles/services/hoteles.service';
import { TipoHabitacion, Habitacion } from '../interfaces/habitacion.interface';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HabitacionesService } from '../services/habitaciones.service';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './add-room.component.html',
  styleUrl: './add-room.component.scss'
})
export class AddRoomComponent {

  @Output() cancelarCrear: EventEmitter<void> = new EventEmitter<void>(); // Para cerrar el modal con el boton de cancelar
  @Input() hotel: any; // Recibe el hotel seleccionado

  public tiposHabitacion = [
    { label: 'INDIVIDUAL', value: 'INDIVIDUAL' },
    { label: 'DOBLE', value: 'DOBLE' },
    { label: 'TRIPLE', value: 'TRIPLE' },
    { label: 'CUÁDRUPLE', value: 'CUADRUPLE' },
    { label: 'SUITE', value: 'SUITE' }
  ];

  public serviciosDisponibles: string[] = ['COCINA', 'TERRAZA', 'JACUZZI'];

  public preciosBase = {
    INDIVIDUAL: 0,
    DOBLE: 0,
    TRIPLE: 0,
    CUADRUPLE: 0,
    SUITE: 0
  };

  public preciosServicios = {
    Cocina: 0,
    Terraza: 0,
    Jacuzzi: 0
  };

  public serviciosSeleccionados = {
    COCINA: false,
    TERRAZA: false,
    JACUZZI: false
  };

  public generadorForm: FormGroup;
  public habitacionesGeneradas: any[] = [];
  private contadorHabitaciones = 1;

  private habitacionServicios: string[] = [];

  constructor(private formBuilder: FormBuilder, private habitacionesService: HabitacionesService) {
    this.generadorForm = this.formBuilder.group({
      cantidad: [1, [Validators.required, Validators.min(1)]],
      tipoHabitacion: ['', Validators.required]
    });
  }

  // Función para alternar los servicios seleccionados
  toggleServicio(servicio: string) {
    this.serviciosSeleccionados[servicio] = !this.serviciosSeleccionados[servicio];
  }

  // Función para calcular el precio de la habitación
  calcularPrecio(tipoHabitacion: string): number {
    let precio = this.preciosBase[tipoHabitacion] || 0;
    for (const servicio of Object.keys(this.serviciosSeleccionados)) {
      if (this.serviciosSeleccionados[servicio]) {
        precio += this.preciosServicios[servicio] || 0;
      }
    }
    return precio;
  }

  // Función para agregar habitaciones
  agregarHabitaciones() {
    const cantidad = this.generadorForm.value.cantidad;
    const tipoHabitacion = this.generadorForm.value.tipoHabitacion;

    for (let i = 0; i < cantidad; i++) {
      const habitacion = {
        id: null,
        numero: this.contadorHabitaciones,
        tipoHabitacion: tipoHabitacion,
        servicios: Object.keys(this.serviciosSeleccionados).filter(servicio => this.serviciosSeleccionados[servicio]),
        precioNoche: this.calcularPrecio(tipoHabitacion),
        hotel: this.hotel
      };
      this.habitacionesGeneradas.push(habitacion);
      this.contadorHabitaciones++;
    }

    // Reiniciar selección de servicios
    this.serviciosSeleccionados = { COCINA: false, TERRAZA: false, JACUZZI: false };
    this.generadorForm.reset();
  }

  // Función para guardar todas las habitaciones generadas
  guardarHabitaciones() {
    this.habitacionesGeneradas.forEach(habitacion => {
      this.habitacionesService.crearHabitacion(habitacion).subscribe(
        response => {
          // Muestra una notificación de éxito o cualquier otro manejo
          window.location.reload();
        },
        error => {
          // Muestra una notificación de error o cualquier otro manejo
        })
    })
    /*this.habitacionesService.crearHabitacion(this.habitacionesGeneradas).subscribe(
      response => {
        // Muestra una notificación de éxito o cualquier otro manejo
      },
      error => {
        // Muestra una notificación de error o cualquier otro manejo
      }
    );*/
  }

  ocultarModalEditarHabitacion() {
    this.cancelarCrear.emit();
  }

}
