import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Hotel } from '../../hoteles/interfaces/hotel.interface';
import { HotelesService } from '../../hoteles/services/hoteles.service';
import { CategoriaServicio, Servicio } from '../interfaces/servicio.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-service',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-service.component.html',
  styleUrl: './add-service.component.scss'
})
export class AddServiceComponent {

  @Output() cancelarCrear: EventEmitter<void> = new EventEmitter<void>(); // Para cerrar el modal con el boton de cancelar

  @ViewChild('nombreInput') nombreInput: { nativeElement: { value: string; }; };
  @ViewChild('descripcionInput') descripcionInput: { nativeElement: { value: string; }; };
  @ViewChild('categoriaSelect') categoriaSelect: { nativeElement: { value: string; }; };
  @ViewChild('hotelSelect') hotelSelect: { nativeElement: { value: number; }; };

  public servicioForm: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    idHotel: ['', [Validators.required]],
  })

  public hoteles: Hotel[];

  constructor(private hotelesService: HotelesService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.hotelesService.getAllHoteles().subscribe(hoteles => this.hoteles = hoteles);
  }

  isValidFieldServicio(field: string) {
    return this.servicioForm.controls[field].errors && this.servicioForm.controls[field].touched
  }

  getFieldErrorServicio(field: string) {

    if (!this.servicioForm.controls[field]) return null;

    const errors = this.servicioForm.controls[field].errors;

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es obligatorio'
      }
    }

    return null;
  }

  onSubmit() {

    if (this.servicioForm.invalid) {
      this.servicioForm.markAllAsTouched();
      return;
    }

    const nombre = this.nombreInput.nativeElement.value;
    const descripcion = this.descripcionInput.nativeElement.value;
    const categoria = this.categoriaSelect.nativeElement.value;
    const idHotel = this.hotelSelect.nativeElement.value;

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

    // Llamar a tu servicio para crear el servicio con los datos recopilados
    const servicio: Servicio = {
      nombre: nombre,
      descripcion: descripcion,
      categoria: cat
    };

    this.hotelesService.addServicio(idHotel, servicio).subscribe(
      response => {
        console.log('Servicio añadido con éxito:', response);
        window.location.reload();
      },
      error => {
        console.error('Error al añadir servicio:', error);
      }
    );
  }

  ocultarModalEditarServicio() {
    this.cancelarCrear.emit();
  }

}
