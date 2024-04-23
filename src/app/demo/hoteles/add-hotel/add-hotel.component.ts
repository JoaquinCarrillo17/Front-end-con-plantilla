import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Hotel } from '../interfaces/hotel.interface';
import { HotelesService } from '../services/hoteles.service';
import { CategoriaServicio } from '../../servicios/interfaces/servicio.interface';
import { TipoHabitacion } from '../../habitaciones/interfaces/habitacion.interface';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-hotel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
  @ViewChild('categoriaServicio') categoriaServicio: { nativeElement: { value: string; }; };
  @ViewChild('numeroHabitacion') numeroHabitacion: { nativeElement: { value: number; }; };
  @ViewChild('tipoHabitacion') tipoHabitacion: { nativeElement: { value: string; }; };
  @ViewChild('precioHabitacion') precioHabitacion: { nativeElement: { value: number; }; };

  public servicioForm: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    categoria: ['Elige una categoría', [Validators.required]]
  })

  public hotelForm: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    email: ['', [Validators.required, Validators.email]], // Validar formato de email
    sitioWeb: ['', [Validators.required, Validators.pattern(/^(www\..*)$/)]], // Validar que empiece con 'www'
  });

  error: string = ''; // Variable para almacenar mensajes de error
  errorServicio: string = ''; // Variable para almacenar mensajes de error
  errorHabitacion: string = ''; // Variable para almacenar mensajes de error

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

  isValidFieldServicio(field: string) {
    return this.servicioForm.controls[field].errors && this.servicioForm.controls[field].touched
  }

  getFieldErrorServicio(field: string) {

    if (!this.servicioForm.controls[field]) return null;

    const errors = this.servicioForm.controls[field].errors;
    console.log(errors);

    for (const key of Object.keys(errors)) {
      console.log(key);
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

  isValidFieldHotel(field: string) {
    return this.hotelForm.controls[field].errors && this.hotelForm.controls[field].touched
  }

  getFieldErrorHotel(field: string) {

    if (!this.hotelForm.controls[field]) return null;

    const errors = this.hotelForm.controls[field].errors;
    console.log(errors);

    for (const key of Object.keys(errors)) {
      console.log(key);
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

  onSubmit() {

    if (this.hotelForm.valid) {
      console.log(this.hotelForm.value)
      console.log(this.hotelForm.controls['nombre']);
      this.hotelForm.reset();
      return;
    }

    if (this.hotelForm.invalid) {
      this.hotelForm.markAllAsTouched();
      return;
    }

    const nombre = this.nombreInput.nativeElement.value;
    const direccion = this.direccionInput.nativeElement.value;
    const telefono = this.telefonoInput.nativeElement.value;
    const email = this.emailInput.nativeElement.value;
    const sitioWeb = this.sitioWebInput.nativeElement.value;

    // Validar campos requeridos manualmente
    if (!nombre || !direccion || !email || !telefono || !sitioWeb) {
      // Mostrar mensaje de error
      this.error = 'Por favor complete todos los campos requeridos.';
      return; // Detener la ejecución del método
    }

    // Si no hay errores, limpiar el mensaje de error
    this.error = '';

    this.hotel = {
      nombre: nombre,
      direccion: direccion,
      telefono: telefono,
      email: email,
      sitioWeb: sitioWeb,
      servicios: this.hotel.servicios,
      habitaciones: this.hotel.habitaciones,
    };

    this.hotelesService.addHotel(this.hotel).subscribe(
      response => {
        console.log('Hotel creado con exito:', response);
        window.location.reload();
      },
      error => {
        console.error('Error al crear el hotel:', error);
      }
    );
  }

  agregarServicio() {
    const nombre = this.nombreServicio.nativeElement.value;
    const descripcion = this.descripcionServicio.nativeElement.value;
    const categoria = this.categoriaServicio.nativeElement.value;

    // Validar campos requeridos manualmente
    if (!nombre || !descripcion || !categoria) {
      // Mostrar mensaje de error
      this.errorServicio = 'Por favor complete todos los campos requeridos.';
      return; // Detener la ejecución del método
    }

    // Si no hay errores, limpiar el mensaje de error
    this.errorServicio = '';

    let cat: CategoriaServicio;
    switch (categoria) {
      case "GIMNASIO":
        cat = CategoriaServicio.GIMNASIO;
        break;
      case "BAR":
        cat = CategoriaServicio.BAR;
        break;
      case "LAVANDERIA":
        cat = CategoriaServicio.LAVANDERIA;
        break;
      case "CASINO":
        cat = CategoriaServicio.CASINO;
        break;
      case "KARAOKE":
        cat = CategoriaServicio.KARAOKE;
        break;

      default:
        break;
    }

    // Agregar el servicio al array de servicios del hotel
    this.hotel.servicios.push({
      nombre: nombre,
      descripcion: descripcion,
      categoria: cat
    });

    // Resetear los campos del servicio
    this.nombreServicio.nativeElement.value = '';
    this.descripcionServicio.nativeElement.value = '';
    this.categoriaServicio.nativeElement.value = '';
    this.ocultarFormularioServicio();
  }

  agregarHabitacion() {
    const numero = this.numeroHabitacion.nativeElement.value;
    const tipo = this.tipoHabitacion.nativeElement.value;
    const precio = this.precioHabitacion.nativeElement.value;

    // Validar campos requeridos manualmente
    if (!numero || !tipo || !precio) {
      // Mostrar mensaje de error
      this.errorHabitacion = 'Por favor complete todos los campos requeridos.';
      return; // Detener la ejecución del método
    }

    // Si no hay errores, limpiar el mensaje de error
    this.errorHabitacion = '';

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
    this.ocultarFormularioHabitacion();
  }

  // * Para el comportamiento de los forms del servicio y habitacion

  mostrarFormularioServicio() {
    const formularioServicio = document.getElementById('formulario-servicio');
    formularioServicio.classList.add('mostrar');
  }

  ocultarFormularioServicio() {
    const formularioServicio = document.getElementById('formulario-servicio');
    formularioServicio.classList.remove('mostrar');
  }

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
