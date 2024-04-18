import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Hotel } from '../../hoteles/interfaces/hotel.interface';
import { HotelesService } from '../../hoteles/services/hoteles.service';
import { CategoriaServicio, Servicio } from '../interfaces/servicio.interface';

@Component({
  selector: 'app-add-service',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-service.component.html',
  styleUrl: './add-service.component.scss'
})
export class AddServiceComponent {

  @ViewChild('nombreInput') nombreInput: { nativeElement: { value: string; }; };
  @ViewChild('descripcionInput') descripcionInput: { nativeElement: { value: string; }; };
  @ViewChild('categoriaSelect') categoriaSelect: { nativeElement: { value: string; }; };
  @ViewChild('hotelSelect') hotelSelect: { nativeElement: { value: number; }; };

  public hoteles: Hotel[];

  constructor(private hotelesService: HotelesService) { }

  ngOnInit(): void {
    this.hotelesService.getAllHoteles().subscribe(hoteles => this.hoteles = hoteles);
  }

  onSubmit() {
    // ! EL REQUIRED SOLO FUNCIONA SI PONGO EL BOTON SUBMIT PERO SI HAGO ESTO NO PUEDO HACER EL ROUTER NI VER LOS PRINTS
    const nombre = this.nombreInput.nativeElement.value;
    const descripcion = this.descripcionInput.nativeElement.value;
    const categoria = this.categoriaSelect.nativeElement.value;
    const idHotel = this.hotelSelect.nativeElement.value;

    // Aquí puedes hacer lo que quieras con los datos, como enviarlos a tu servicio para crear el servicio
    console.log('Nombre:', nombre);
    console.log('Descripción:', descripcion);
    console.log('Categoría:', categoria);
    console.log('Hotel:', idHotel);

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

}
