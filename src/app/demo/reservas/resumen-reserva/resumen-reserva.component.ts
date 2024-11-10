import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitacionesService } from '../../habitaciones/services/habitaciones.service';
import { ReservasService } from '../reservas.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-resumen-reserva',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,],
  templateUrl: './resumen-reserva.component.html',
  styleUrl: './resumen-reserva.component.scss'
})
export class ResumenReservaComponent implements OnInit {

  habitacion: any;
  checkIn: string;
  checkOut: string;
  huespedForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private habitacionesService: HabitacionesService,
    private reservasService: ReservasService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.huespedForm = this.fb.group({
      huespedes: this.fb.array([]),
    });
  }

  // Método para inicializar un FormGroup para un huésped
  private createHuespedFormGroup(huesped): FormGroup {
    return this.fb.group({
        dni: [huesped.dni],
        email: [huesped.email],
        id: [huesped.id],
        nombreCompleto: [huesped.nombreCompleto]
    });
  }

  ngOnInit(): void {
    const reservaData = sessionStorage.getItem('reservaData');
    if (reservaData) {
        const { habitacionId, checkIn, checkOut, huespedes } = JSON.parse(reservaData);

        this.checkIn = checkIn;
        this.checkOut = checkOut;
        // Limpia el FormArray actual antes de asignar nuevos valores
        const huespedesFormArray = this.huespedForm.get('huespedes') as FormArray;
        huespedesFormArray.clear();

        // Mapea cada huesped a un nuevo FormGroup o FormControl dentro del FormArray
        huespedes.forEach(huesped => {
          huespedesFormArray.push(this.createHuespedFormGroup(huesped));
        });
        console.log(this.huespedForm.value)

        this.cdr.markForCheck();

        this.loadHabitacion(habitacionId);

        // Puedes limpiar el sessionStorage si ya no necesitas los datos
        sessionStorage.removeItem('reservaData');
    } else {
    this.route.queryParams.subscribe(params => {
      const habitacionId = params['habitacionId'];
      this.checkIn = params['checkIn'];
      this.checkOut = params['checkOut'];

      if (habitacionId) {
        this.loadHabitacion(habitacionId);
      }
    });
  }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  loadHabitacion(habitacionId: string): void {
    this.habitacionesService.getHabitacionById(habitacionId).subscribe(habitacion => {
      this.habitacion = habitacion;
      this.initializeHuespedesForm();
    });
  }

  initializeHuespedesForm(): void {
    const capacidad = this.getCapacidadHabitacion(this.habitacion.tipoHabitacion);
    const huespedesArray = this.huespedForm.get('huespedes') as FormArray;
    huespedesArray.clear();

    for (let i = 0; i < capacidad; i++) {
      huespedesArray.push(
        this.fb.group({
          id: [null],
          nombreCompleto: ['', Validators.required],
          dni: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]]
        })
      );
    }
  }

  get huespedes(): FormArray {
    return this.huespedForm.get('huespedes') as FormArray;
  }

  getCapacidadHabitacion(tipoHabitacion: string): number {
    const capacidadMap = {
      'INDIVIDUAL': 1,
      'DOBLE': 2,
      'TRIPLE': 3,
      'CUADRUPLE': 4,
      'SUITE': 2
    };
    return capacidadMap[tipoHabitacion] || 1;
  }

  confirmarReserva(): void {
    if (localStorage.getItem('auth_token') == null) {
      sessionStorage.setItem('reservaData', JSON.stringify({
        habitacionId: this.habitacion.id,
        checkIn: this.checkIn,
        checkOut: this.checkOut,
        huespedes: this.huespedes.value
      }));

      this.router.navigate(['/auth/login'], {
        queryParams: { redirectUrl: '/resumen-reserva' }
    });
    } else {
      const reserva = {
        idUsuario: localStorage.getItem('usuario'),
        checkIn: new Date(this.checkIn),
        checkOut: new Date(this.checkOut),
        coste: this.calcularTotal(),
        habitacion: this.habitacion,
        hotel: this.habitacion.hotel,
        huespedes: this.huespedes.value
      };

      this.reservasService.createReserva(reserva).subscribe(
        response => {
          console.log('Reserva creada:', response);
          //this.router.navigate(['/confirmacion']); // Redirigir a una página de confirmación
        },
        error => {
          console.error('Error al crear la reserva', error);
        }
      );
      console.log("Reserva a crear: ", reserva)
    }

  }

  calcularNoches(): number {
    const checkInDate = new Date(this.checkIn);
    const checkOutDate = new Date(this.checkOut);
    return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  calcularTotal(): number {
    return this.calcularNoches() * this.habitacion.precioNoche;
  }

  cancelarReserva(): void {
    this.router.navigate(['/habitaciones']); // Redirigir de vuelta a la lista de habitaciones
  }
}
