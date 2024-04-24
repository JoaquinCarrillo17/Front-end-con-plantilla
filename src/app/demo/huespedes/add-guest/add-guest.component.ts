import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Habitacion } from '../../habitaciones/interfaces/habitacion.interface';
import { HabitacionesService } from '../../habitaciones/services/habitaciones.service';
import { Huesped } from '../interfaces/huesped.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-guest',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  public huespedForm: FormGroup = this.formBuilder.group({
    nombreCompleto: ['', [Validators.required]],
    dni: ['', [Validators.required, this.dniValidator()]],
    email: ['', [Validators.required, Validators.email]],
    fechaEntrada: ['', [Validators.required, this.fechaValidator()]],
    fechaSalida: ['', [Validators.required, this.fechaValidator()]],
    idHabitacion: ['', [Validators.required]],
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

  public habitaciones: Habitacion[];

  constructor(private habitacionesService: HabitacionesService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.habitacionesService.getAllHabitaciones().subscribe(habitaciones => this.habitaciones = habitaciones);
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

  onSubmit() {

    if (this.huespedForm.invalid) {
      this.huespedForm.markAllAsTouched();
      return;
    }
    
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
