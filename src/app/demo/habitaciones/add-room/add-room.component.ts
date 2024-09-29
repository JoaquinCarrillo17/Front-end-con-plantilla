import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Hotel } from '../../hoteles/interfaces/hotel.interface';
import { HotelesService } from '../../hoteles/services/hoteles.service';
import { TipoHabitacion, Habitacion } from '../interfaces/habitacion.interface';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Huesped } from '../../huespedes/interfaces/huesped.interface';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
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

  public showCrearHabitacionNotification = false;
  public showCrearHabitacionErrorNotification = false;

  public serviciosDisponibles: string[] = ['COCINA', 'TERRAZA', 'JACUZZI'];

  public habitacionForm: FormGroup = this.formBuilder.group({
    numero: ['', [Validators.required, Validators.min(0)]],
    tipoHabitacion: ['', [Validators.required]],
    precio: ['', [Validators.required, Validators.min(0)]],
    idHotel: ['', [Validators.required]],
  })

  public huespedForm: FormGroup = this.formBuilder.group({
    nombreCompleto: ['', [Validators.required]],
    dni: ['', [Validators.required, this.dniValidator()]],
    email: ['', [Validators.required, Validators.email]],
    fechaEntrada: ['', [Validators.required, this.fechaValidator()]],
    fechaSalida: ['', [Validators.required, this.fechaValidator()]],
  })

  // Función de validación para el formato del DNI
  dniValidator() {
    return (control) => {
      const dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
      const valid = dniRegex.test(control.value);
      return valid ? null : { invalidDNI: true };
    };
  }

  // Función de validación para fechas
  fechaValidator() {
    return (control) => {
      const currentDate = new Date();
      const inputDate = new Date(control.value);
      const valid = inputDate >= currentDate;
      return valid ? null : { invalidDate: true };
    };
  }


  public hoteles: Hotel[];
  public habitacion: any = {
    numero: 0,
    tipoHabitacion: null,
    precioNoche: 0,
    servicios: [],
    huespedes: [],
  }

  constructor(private hotelesService: HotelesService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.hotelesService.getAllHoteles().subscribe(hoteles => this.hoteles = hoteles);
  }

  // Para el validator

  isValidFieldHabitacion(field: string) {
    return this.habitacionForm.controls[field].errors && this.habitacionForm.controls[field].touched
  }

  getFieldErrorHabitacion(field: string) {

    if (!this.habitacionForm.controls[field]) return null;

    const errors = this.habitacionForm.controls[field].errors;

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es obligatorio'
        case 'min':
          return 'Este campo no puede ser menor que 0'
      }
    }

    return null;
  }

  isValidFieldHuesped(field: string) {
    return this.huespedForm.controls[field].errors && this.huespedForm.controls[field].touched
  }

  getFieldErrorHuesped(field: string) {

    if (!this.huespedForm.controls[field]) return null;

    const errors = this.huespedForm.controls[field].errors;

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es obligatorio'
        case 'invalidDNI':
          return 'Formato de DNI inválido'
        case 'invalidDate':
          return 'La fecha no puede ser anterior al momento actual'
        case 'email':
          return 'Este campo debe contener "@"';
      }
    }

    return null;
  }

  onCheckboxChange(event: any) {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      // Agregar el servicio si está seleccionado
      this.habitacion.servicios.push(value);
    } else {
      // Eliminar el servicio si se ha desmarcado
      const index = this.habitacion.servicios.indexOf(value);
      if (index !== -1) {
        this.habitacion.servicios.splice(index, 1);
      }
    }
  }

  onSubmit() {

    if (this.habitacionForm.invalid) {
      this.habitacionForm.markAllAsTouched();
      return;
    }

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

    const habitacion: any = {
      numero: numero,
      tipoHabitacion: tipoHabitacion,
      precioNoche: precio,
      servicios: this.habitacion.servicios,
      huespedes: this.habitacion.huespedes,
    };

    this.hotelesService.addHabitacion(idHotel, habitacion).subscribe(
      response => {
        this.showCrearHabitacionNotification = true; // Mostrar la notificación
        setTimeout(() => {
        this.showCrearHabitacionNotification = false; // Ocultar la notificación después de 2 segundos
      }, 3000);
      },
      error => {
        this.showCrearHabitacionErrorNotification = true; // Mostrar la notificación
        setTimeout(() => {
        this.showCrearHabitacionErrorNotification = false; // Ocultar la notificación después de 2 segundos
      }, 3000);
      }
    );
  }

  agregarHuesped() {

    if (this.huespedForm.invalid) {
      this.huespedForm.markAllAsTouched();
      return;
    }

    const nombre = this.nombreHuesped.nativeElement.value;
    const dni = this.dniHuesped.nativeElement.value;
    const email = this.emailHuesped.nativeElement.value;
    const fechaEntrada = this.fechaEntrada.nativeElement.value;
    const fechaSalida = this.fechaSalida.nativeElement.value;

    const huesped: Huesped = {
      nombreCompleto: nombre,
      dni: dni,
      email: email,
      fechaCheckIn: new Date(fechaEntrada),
      fechaCheckOut: new Date(fechaSalida),
    };

    this.habitacion.huespedes.push(huesped);

    console.log(this.habitacion.huespedes)

    this.nombreHuesped.nativeElement.value = '';
    this.dniHuesped.nativeElement.value = '';
    this.emailHuesped.nativeElement.value = '';
    this.fechaEntrada.nativeElement.value = '';
    this.fechaSalida.nativeElement.value = '';
    this.huespedForm.reset();
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
