import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { HotelesService } from '../services/hoteles.service';
import { SharedModule } from "../../../theme/shared/shared.module";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-hotel',
  standalone: true,
  templateUrl: './edit-hotel.component.html',
  styleUrls: ['./edit-hotel.component.scss'],
  imports: [SharedModule]
})
export class EditHotelComponent {

  hotelForm: FormGroup;


  public categorias: string[] = ['GIMNASIO', 'LAVANDERIA', 'BAR', 'CASINO', 'KARAOKE', 'MASCOTA', 'PISCINA', 'PARKING'];



  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditHotelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hotel: any } // Recibir el objeto hotel directamente
  ) {
    this.hotelForm = this.formBuilder.group({
      nombre: [data.hotel.nombre, Validators.required],
      direccion: [data.hotel.direccion, Validators.required],
      telefono: [data.hotel.telefono, Validators.required],
      email: [data.hotel.email, [Validators.required, Validators.email]],
      sitioWeb: [data.hotel.sitioWeb],
      ciudad: [data.hotel.ubicacion.ciudad, Validators.required],
      pais: [data.hotel.ubicacion.pais, Validators.required],
      continente: [data.hotel.ubicacion.continente, Validators.required],
      servicios: [data.hotel.servicios],
    });
  }

  isChecked(categoria: string): boolean {
    const servicios: string[] = this.hotelForm.get('servicios')?.value || [];
    return servicios.includes(categoria);
  }

  onCheckboxChange(event: any): void {
    const value = event.target.value;
    const isChecked = event.target.checked;

    const servicios: string[] = this.hotelForm.get('servicios')?.value || [];

    if (isChecked) {
      // Añadir el servicio al array si no existe
      if (!servicios.includes(value)) {
        servicios.push(value);
      }
    } else {
      // Eliminar el servicio del array si está presente
      const index = servicios.indexOf(value);
      if (index !== -1) {
        servicios.splice(index, 1);
      }
    }

    // Actualizar el control de servicios en el formulario
    this.hotelForm.get('servicios')?.setValue(servicios);
  }

  saveHotel(): void {
    if (this.hotelForm.valid) {
      this.dialogRef.close(this.hotelForm.value);
    } else this.hotelForm.markAllAsTouched()
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
