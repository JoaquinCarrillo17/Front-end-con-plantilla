import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Huesped } from '../interfaces/huesped.interface';
import { HuespedesService } from '../services/huespedes.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-edit-guest',
  standalone: true,
  imports: [FormsModule, CommonModule, SharedModule],
  templateUrl: './edit-guest.component.html',
  styleUrl: './edit-guest.component.scss'
})
export class EditGuestComponent {

  @Input() idHuesped: number;
  @Output() editComplete: EventEmitter<void> = new EventEmitter<void>();
  public huesped: any = { // ? cuando abro el modal editar actualizo este huesped para que me aparezcan los campos
    id: 0,
    nombreCompleto: '',
    dni: '',
    email: ''
  };

  public showEditarHuespedNotification = false;
  public showEditarHuespedErrorNotification = false;

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
      this.huesped = {
        id: 0,
        nombreCompleto: '',
        dni: '',
        email: '',
      };
      this.ocultarModalEditarHuesped();
      this.showEditarHuespedNotification = true;
      setTimeout(() => {
        this.showEditarHuespedNotification = false;
      }, 3000);
      window.location.reload(); // ? Recargo la pagina para mostrar los cambios
    },
      error => {
        this.showEditarHuespedErrorNotification = true;
        setTimeout(() => {
          this.showEditarHuespedErrorNotification = false;
        }, 3000);
      }
    )
  }

  ocultarModalEditarHuesped() {
    this.editComplete.emit();
  }

}
