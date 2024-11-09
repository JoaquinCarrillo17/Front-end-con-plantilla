import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotelesService } from '../services/hoteles.service';
import { SharedModule } from "../../../theme/shared/shared.module";

@Component({
  selector: 'app-edit-hotel',
  standalone: true,
  templateUrl: './edit-hotel.component.html',
  styleUrls: ['./edit-hotel.component.scss'],
  imports: [SharedModule]
})
export class EditHotelComponent implements OnInit {

  @Input() idHotel: number;
  @Output() editComplete: EventEmitter<void> = new EventEmitter<void>();
  public hotel: any = {
    id: 0,
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    ubicacion: { ciudad: '', pais: '', continente: '' },
    servicios: [],
  };

  public categorias: string[] = ['GIMNASIO', 'LAVANDERIA', 'BAR', 'CASINO', 'KARAOKE', 'MASCOTA', 'PISCINA', 'PARKING'];

  public showEditarHotelNotification = false;
  public showEditarHotelErrorNotification = false;

  constructor(private hotelesService: HotelesService) { }

  ngOnInit(): void {
    this.hotelesService.getById(this.idHotel).subscribe(data => {
      this.hotel = data;
    },
    error => {
      console.log("Error al obtener el hotel: " + error);
    });
  }

  isChecked(categoria: string): boolean {
    return this.hotel.servicios.includes(categoria);
  }

  onCheckboxChange(event: any) {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      this.hotel.servicios.push(value);
    } else {
      const index = this.hotel.servicios.indexOf(value);
      if (index !== -1) {
        this.hotel.servicios.splice(index, 1);
      }
    }
  }

  editHotel() {
    this.hotelesService.editHotel(this.idHotel, this.hotel).subscribe(response => {
      this.ocultarModalEditarHotel();
      this.showEditarHotelNotification = true;
      setTimeout(() => this.showEditarHotelNotification = false, 3000);
    },
    error => {
      this.showEditarHotelErrorNotification = true;
      setTimeout(() => this.showEditarHotelErrorNotification = false, 3000);
    });
  }

  ocultarModalEditarHotel() {
    this.editComplete.emit();
  }
}
