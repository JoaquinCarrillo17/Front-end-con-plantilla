import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ubicacion-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './ubicacion-modal.component.html',
  styleUrl: './ubicacion-modal.component.scss'
})
export class UbicacionModalComponent implements OnInit {
  ubicacionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UbicacionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Recibe la ubicación para editar
  ) {}

  ngOnInit(): void {
    this.ubicacionForm = this.fb.group({
      ciudad: [this.data?.ciudad || '', [Validators.required]],
      pais: [this.data?.pais || '', [Validators.required]],
      continente: [this.data?.continente || '', [Validators.required]]
    });
  }

  onSave(): void {
    if (this.ubicacionForm.valid) {
      this.dialogRef.close(this.ubicacionForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
