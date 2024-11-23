import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Habitacion } from '../../habitaciones/interfaces/habitacion.interface';
import { HabitacionesService } from '../../habitaciones/services/habitaciones.service';
import { Huesped } from '../interfaces/huesped.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HuespedesService } from '../services/huespedes.service';

@Component({
  selector: 'app-add-guest',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './add-guest.component.html',
  styleUrl: './add-guest.component.scss'
})
export class AddGuestComponent {

  @Output() cancelarCrear: EventEmitter<void> = new EventEmitter<void>(); // Para cerrar el modal con el boton de cancelar

  @ViewChild('nombreCompletoInput') nombreCompletoInput: { nativeElement: { value: string; }; };
  @ViewChild('dniInput') dniInput: { nativeElement: { value: string; }; };
  @ViewChild('emailInput') emailInput: { nativeElement: { value: string; }; };

  showNotification: boolean = false;
  message: any;
  color: boolean = false;

  creado: boolean = false;

  public huespedForm: FormGroup = this.formBuilder.group({
    nombreCompleto: ['', [Validators.required]],
    dni: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  })


  constructor(private formBuilder: FormBuilder,
    private huespedesService: HuespedesService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {

    if (this.huespedForm.invalid) {
      this.huespedForm.markAllAsTouched();
      return;
    }

    const nombreCompleto = this.nombreCompletoInput.nativeElement.value;
    const dni = this.dniInput.nativeElement.value;
    const email = this.emailInput.nativeElement.value;

    // Llamar al servicio para crear el huésped con los datos recopilados
    const huesped: any = {
      nombreCompleto: nombreCompleto,
      dni: dni,
      email: email,
    };

    this.huespedesService.addHuesped(huesped).subscribe(
      response => {
        this.showNotification = true;
        this.message = 'Operación realizada con éxito';
        this.color = true;
        this.creado = true;
        setTimeout(() => {
          this.showNotification = false;
          window.location.reload();
        }, 3000);
      },
      error => {
        this.showNotification = true;
        this.message = 'Error al realizar la operación';
        this.color = false;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      }
    );
  }

  ocultarModalEditarHuesped() {
    if (this.creado) {
      this.creado = false;
      window.location.reload(); 
    }
    this.cancelarCrear.emit();
  }

}
