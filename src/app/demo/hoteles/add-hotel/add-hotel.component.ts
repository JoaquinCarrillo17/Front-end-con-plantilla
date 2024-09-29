import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Hotel } from '../interfaces/hotel.interface';
import { HotelesService } from '../services/hoteles.service';
import { CategoriaServicio } from '../../servicios/interfaces/servicio.interface';
import { TipoHabitacion } from '../../habitaciones/interfaces/habitacion.interface';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-add-hotel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './add-hotel.component.html',
  styleUrls: ['./add-hotel.component.scss', './add-hotel.component.css']
})
export class AddHotelComponent {


  @Output() cancelarCrear: EventEmitter<void> = new EventEmitter<void>(); // Para cerrar el modal con el boton de cancelar

  @ViewChild('nombreInput') nombreInput: { nativeElement: { value: string; }; };
  @ViewChild('direccionInput') direccionInput: { nativeElement: { value: string; }; };
  @ViewChild('telefonoInput') telefonoInput: { nativeElement: { value: string; }; };
  @ViewChild('emailInput') emailInput: { nativeElement: { value: string; }; };
  @ViewChild('sitioWebInput') sitioWebInput: { nativeElement: { value: string; }; };
  @ViewChild('nombreServicio') nombreServicio: { nativeElement: { value: string; }; };
  @ViewChild('descripcionServicio') descripcionServicio: { nativeElement: { value: string; }; };
  @ViewChild('categoriaServicio') categoriaServicio: { nativeElement: { value: string[]; }; };
  @ViewChild('numeroHabitacion') numeroHabitacion: { nativeElement: { value: number; }; };
  @ViewChild('tipoHabitacion') tipoHabitacion: { nativeElement: { value: string; }; };
  @ViewChild('precioHabitacion') precioHabitacion: { nativeElement: { value: number; }; };

  public categorias: string[] = ['GIMNASIO', 'LAVANDERIA', 'BAR', 'CASINO', 'KARAOKE', 'MASCOTA', 'PISCINA', 'PARKING'];

  public showCrearHotelNotification = false;
  public showCrearHotelErrorNotification = false;

  public habitacionForm: FormGroup = this.formBuilder.group({
    numero: ['', [Validators.required, Validators.min(0)]],
    tipoHabitacion: ['', [Validators.required]],
    precio: ['', [Validators.required, Validators.min(0)]]
  })

  public servicioForm: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    categoria: ['', [Validators.required]]
  })

  public hotelForm: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    email: ['', [Validators.required, Validators.email]], // Validar formato de email
    sitioWeb: ['', [Validators.required, Validators.pattern(/^(www\..*)$/)]], // Validar que empiece con 'www'
    categoria: [[], Validators.required]
  });

  hotel: Hotel = {
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    servicios: [],
    habitaciones: [],
  };

  constructor(private hotelesService: HotelesService, private formBuilder: FormBuilder) { }

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


  isValidFieldHotel(field: string) {
    return this.hotelForm.controls[field].errors && this.hotelForm.controls[field].touched
  }

  getFieldErrorHotel(field: string) {

    if (!this.hotelForm.controls[field]) return null;

    const errors = this.hotelForm.controls[field].errors;

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es obligatorio'
        case 'minlength':
          return 'Este campo debe tener 9 caracteres'
        case 'maxlength':
          return 'Este campo debe tener 9 caracteres'
        case 'email':
          return 'Este campo debe contener "@"';
        case 'pattern':
          return 'Este campo debe empezar con "www"';
      }
    }

    return null;
  }

  isChecked(categoria: string): boolean {
    const categoriaArray = this.hotelForm.get('categoria').value;
    return categoriaArray.includes(categoria);
  }


  onCheckboxChange(event: any) {
    const categoriaArray: string[] = this.hotelForm.get('categoria').value;
    if (event.target.checked) {
      categoriaArray.push(event.target.value);
    } else {
      const index = categoriaArray.indexOf(event.target.value);
      if (index > -1) {
        categoriaArray.splice(index, 1);
      }
    }
    this.hotelForm.get('categoria').setValue(categoriaArray);
  }

  onSubmit() {

    if (this.hotelForm.invalid) {
      this.hotelForm.markAllAsTouched();
      return;
    }

    this.hotel = {
      nombre: this.hotelForm.get('nombre').value,
      direccion: this.hotelForm.get('direccion').value,
      telefono: this.hotelForm.get('telefono').value,
      email: this.hotelForm.get('email').value,
      sitioWeb: this.hotelForm.get('sitioWeb').value,
      servicios: this.hotelForm.get('categoria').value,
      habitaciones: this.hotel.habitaciones
    };

    this.hotelesService.addHotel(this.hotel).subscribe(
      response => {
        this.showCrearHotelNotification = true; // Mostrar la notificación
        setTimeout(() => {
        this.showCrearHotelNotification = false; // Ocultar la notificación después de 2 segundos
      }, 3000);
      },
      error => {
        this.showCrearHotelErrorNotification = true; // Mostrar la notificación
        setTimeout(() => {
        this.showCrearHotelErrorNotification = false; // Ocultar la notificación después de 2 segundos
      }, 3000);
      }
    );
  }

  agregarHabitacion() {

    if (this.habitacionForm.invalid) {
      this.habitacionForm.markAllAsTouched();
      return;
    }

    const numero = this.numeroHabitacion.nativeElement.value;
    const tipo = this.tipoHabitacion.nativeElement.value;
    const precio = this.precioHabitacion.nativeElement.value;

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

    // Agregar la habitación al array de habitaciones del hotel
    this.hotel.habitaciones.push({
      numero: numero,
      tipoHabitacion: tipoHabitacion,
      precioNoche: precio,
      huespedes: []
    });

    // Resetear los campos de la habitación
    this.numeroHabitacion.nativeElement.value = null;
    this.tipoHabitacion.nativeElement.value = '';
    this.precioHabitacion.nativeElement.value = null;
    this.habitacionForm.reset();
    this.ocultarFormularioHabitacion();
  }

  // * Para el comportamiento de los forms del servicio y habitacion

  mostrarFormularioHabitacion() {
    const formularioHabitacion = document.getElementById('formulario-habitacion');
    formularioHabitacion.classList.add('mostrar');
  }

  ocultarFormularioHabitacion() {
    const formularioHabitacion = document.getElementById('formulario-habitacion');
    formularioHabitacion.classList.remove('mostrar');
  }

  ocultarModalEditarHotel() {
    this.cancelarCrear.emit();
  }



}
