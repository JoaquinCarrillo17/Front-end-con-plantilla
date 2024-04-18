import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Hotel } from '../interfaces/hotel.interface';
import { HotelesService } from '../services/hoteles.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-edit-hotel',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-hotel.component.html',
  styleUrl: './edit-hotel.component.scss'
})
export class EditHotelComponent implements OnInit {

  @Input() idHotel: number;
  @Output() editComplete: EventEmitter<void> = new EventEmitter<void>();
  public hotel: Hotel = { // ? cuando abro el modal editar actualizo este hotel para que me aparezcan los campos
    id: 0,
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    servicios: [],
    habitaciones: []
  };

  constructor(private hotelesService: HotelesService) { }

  ngOnInit(): void {
    this.hotelesService.getHotelFull(this.idHotel).subscribe(data => {
      this.hotel = data;
    },
    error => {
      console.log("Error al obtener el hotel: " + error);
    }
  );
  }

  editHotel() {
    this.hotelesService.editHotel(this.idHotel, this.hotel).subscribe(response => {
      console.log("El hotel se editó correctamente")
      this.hotel = {
        id: 0,
        nombre: '',
        direccion: '',
        telefono: '',
        email: '',
        sitioWeb: '',
        servicios: [],
        habitaciones: []
      };
      this.ocultarModalEditarHotel();
      window.location.reload(); // ? Recargo la pagina para mostrar los cambios
    },
    error => {
      console.error(`Error al editar el hotel` + error)
    }
    )
  }

  ocultarModalEditarHotel() {
    this.editComplete.emit();
  }

}
