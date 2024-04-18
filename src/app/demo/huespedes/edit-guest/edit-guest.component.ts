import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Huesped } from '../interfaces/huesped.interface';
import { HuespedesService } from '../services/huespedes.service';

@Component({
  selector: 'app-edit-guest',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-guest.component.html',
  styleUrl: './edit-guest.component.scss'
})
export class EditGuestComponent {

  @Input() idHuesped: number;
  @Output() editComplete: EventEmitter<void> = new EventEmitter<void>();
  public huesped: Huesped = { // ? cuando abro el modal editar actualizo este huesped para que me aparezcan los campos
    id: 0,
    nombreCompleto: '',
    dni: '',
    email: '',
    fechaCheckIn: null,
    fechaCheckOut: null,
  };

  constructor(private huespedesService: HuespedesService) { }

  ngOnInit(): void {
    this.huespedesService.getHuesped(this.idHuesped).subscribe(data => {
      this.huesped = data;
    },
      error => {
        console.log("Error al obtener el huesped: " + error);
      }
    );
  }

  editHuesped() {
    this.huespedesService.editHuesped(this.idHuesped, this.huesped).subscribe(response => {
      console.log("La huesped se editó correctamente")
      this.huesped = {
        id: 0,
        nombreCompleto: '',
        dni: '',
        email: '',
        fechaCheckIn: null,
        fechaCheckOut: null,
      };
      this.ocultarModalEditarHuesped();
      window.location.reload(); // ? Recargo la pagina para mostrar los cambios
    },
      error => {
        console.error(`Error al editar la huesped` + error)
      }
    )
  }

  ocultarModalEditarHuesped() {
    this.editComplete.emit();
  }

}
