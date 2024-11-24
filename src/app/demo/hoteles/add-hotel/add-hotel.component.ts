import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { HotelesService } from '../services/hoteles.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-hotel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './add-hotel.component.html',
  styleUrls: ['./add-hotel.component.scss', './add-hotel.component.css']
})
export class AddHotelComponent {

  public categorias: string[] = ['GIMNASIO', 'LAVANDERIA', 'BAR', 'CASINO', 'KARAOKE', 'MASCOTA', 'PISCINA', 'PARKING'];

  public hotelForm: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    email: ['', [Validators.required, Validators.email]],
    sitioWeb: ['', [Validators.required, Validators.pattern(/^(www\..*)$/)]],
    ciudad: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    continente: ['', [Validators.required]],
    categoria: [[], Validators.required]
  });


  hotel: any = {
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    servicios: [],
  };

  constructor(private hotelesService: HotelesService, private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddHotelComponent>,
  ) { }

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
      idUsuario: localStorage.getItem('usuario'),
      ubicacion: {
        id : null,
        ciudad: this.hotelForm.get('ciudad').value,
        pais: this.hotelForm.get('pais').value,
        continente: this.hotelForm.get('continente').value
      }
    };

    this.dialogRef.close(this.hotel);
  }

  ocultarModalEditarHotel() {
    this.dialogRef.close(null);
  }



}
