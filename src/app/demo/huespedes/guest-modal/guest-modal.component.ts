import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Huesped } from '../interfaces/huesped.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guest-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './guest-modal.component.html',
  styleUrl: './guest-modal.component.scss'
})
export class GuestModalComponent implements OnInit {
  huespedForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<GuestModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Huesped | null,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.huespedForm = this.formBuilder.group({
      nombreCompleto: [this.data?.nombreCompleto || '', Validators.required],
      dni: [this.data?.dni || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
    });
  }

  onSave(): void {
    if (this.huespedForm.valid) {
      this.dialogRef.close(this.huespedForm.value);
    } else this.huespedForm.markAllAsTouched();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
