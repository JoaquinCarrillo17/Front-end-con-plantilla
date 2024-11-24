import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { HotelesService } from '../../hoteles/services/hoteles.service';
import { TipoHabitacion, Habitacion } from '../interfaces/habitacion.interface';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HabitacionesService } from '../services/habitaciones.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './add-room.component.html',
  styleUrl: './add-room.component.scss'
})
export class AddRoomComponent {

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
    COCINA: 0,
    TERRAZA: 0,
    JACUZZI: 0
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

  constructor(private formBuilder: FormBuilder, private habitacionesService: HabitacionesService, public dialogRef: MatDialogRef<AddRoomComponent>) {
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
    // Validar todos los campos requeridos
    let camposInvalidos = false;

    // Verificar que todos los precios base están rellenados
    for (const tipo in this.preciosBase) {
      if (!this.preciosBase[tipo] || this.preciosBase[tipo] <= 0) {
        console.log("precios base invalidos")
        camposInvalidos = true;
        break;
      }
    }

    // Verificar que todos los precios adicionales por servicio están rellenados
    for (const servicio in this.preciosServicios) {
      if (!this.preciosServicios[servicio] || this.preciosServicios[servicio] <= 0) {
        console.log("servicio ", servicio)
        console.log("precio: " , this.preciosServicios[servicio])
        console.log("servicios invalidos")

        camposInvalidos = true;
        break;
      }
    }

    // Verificar que los campos del formulario están válidos
    if (this.generadorForm.invalid) {
      this.generadorForm.markAllAsTouched(); // Mostrar errores en el formulario
      console.log("form invalido")

      camposInvalidos = true;
    }

    // Si hay campos inválidos, no cerrar el diálogo
    if (camposInvalidos) {
      return;
    }

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
  guardarHabitaciones(): void {
    this.dialogRef.close(this.habitacionesGeneradas);
  }


  ocultarModalEditarHabitacion() {
    this.dialogRef.close(null);
  }

}
