import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-room-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './room-modal.component.html',
  styleUrl: './room-modal.component.scss'
})
export class RoomModalComponent implements OnInit {
  roomForm: FormGroup;
  serviciosDisponibles: string[] = ['COCINA', 'TERRAZA', 'JACUZZI'];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<RoomModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // `data` contiene la habitación si se está editando
  ) {}

  ngOnInit(): void {
    this.roomForm = this.formBuilder.group({
      id: [this.data?.id || '', []], // Solo para referencia, no editable
      numero: [
        { value: this.data?.numero || '', disabled: this.data != null },
        [Validators.required],
      ],
      tipoHabitacion: [this.data?.tipoHabitacion || '', [Validators.required]],
      precioNoche: [this.data?.precioNoche || '', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      servicios: [this.data?.servicios || [], [Validators.required]],
    });
  }

  onCheckboxChange(event: any): void {
    const servicios = this.roomForm.get('servicios')?.value || [];
    const value = event.target.value;

    if (event.target.checked) {
      servicios.push(value);
    } else {
      const index = servicios.indexOf(value);
      if (index !== -1) {
        servicios.splice(index, 1);
      }
    }
    this.roomForm.get('servicios')?.setValue(servicios);
  }

  onSave(): void {
    if (this.roomForm.valid) {
      this.dialogRef.close(this.roomForm.value);
    } else this.roomForm.markAllAsTouched();
  }

  onCancel(): void {
    this.dialogRef.close(null); // Cierra el diálogo sin devolver datos
  }
}
