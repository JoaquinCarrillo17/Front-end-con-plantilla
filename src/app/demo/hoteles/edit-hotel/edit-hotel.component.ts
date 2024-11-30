import { Component, Inject } from '@angular/core';
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
  private hotelDataCopy: any; // Copia del objeto hotel

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditHotelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hotel: any } // Recibir el objeto hotel directamente
  ) {
    // Crear una copia profunda del hotel para evitar modificar el original
    this.hotelDataCopy = {
      ...data.hotel,
      ubicacion: { ...data.hotel.ubicacion },
      servicios: [...(data.hotel.servicios || [])] // Copia profunda del array de servicios
    };

    this.hotelForm = this.formBuilder.group({
      nombre: [this.hotelDataCopy.nombre, Validators.required],
      direccion: [this.hotelDataCopy.direccion, Validators.required],
      telefono: [this.hotelDataCopy.telefono, Validators.required],
      email: [this.hotelDataCopy.email, [Validators.required, Validators.email]],
      sitioWeb: [this.hotelDataCopy.sitioWeb],
      ciudad: [this.hotelDataCopy.ubicacion.ciudad, Validators.required],
      pais: [this.hotelDataCopy.ubicacion.pais, Validators.required],
      continente: [this.hotelDataCopy.ubicacion.continente, Validators.required],
      servicios: [this.hotelDataCopy.servicios],
    });
  }

  isChecked(categoria: string): boolean {
    const servicios: string[] = this.hotelForm.get('servicios')?.value || [];
    return servicios.includes(categoria);
  }

  onCheckboxChange(event: any): void {
    const value = event.target.value;
    const isChecked = event.target.checked;

    const servicios = [...(this.hotelForm.get('servicios')?.value || [])]; // Crear una copia local

    if (isChecked) {
      if (!servicios.includes(value)) {
        servicios.push(value);
      }
    } else {
      const index = servicios.indexOf(value);
      if (index !== -1) {
        servicios.splice(index, 1);
      }
    }

    this.hotelForm.get('servicios')?.setValue(servicios); // Actualizar el control con la copia modificada
  }

  saveHotel(): void {
    if (this.hotelForm.valid) {
      this.dialogRef.close(this.hotelForm.value); // Devuelve los datos del formulario sin modificar el original
    } else {
      this.hotelForm.markAllAsTouched();
    }
  }

  closeDialog(): void {
    this.dialogRef.close(); // Cierra el diálogo sin devolver datos
  }
}
