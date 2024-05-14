import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Servicio } from '../interfaces/servicio.interface';
import { ServiciosService } from '../services/servicios.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [FormsModule, CommonModule, SharedModule],
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.scss'
})
export class EditServiceComponent {

  @Input() idServicio: number;
  @Output() editComplete: EventEmitter<void> = new EventEmitter<void>();
  public servicio: Servicio = { // ? cuando abro el modal editar actualizo este Servicio para que me aparezcan los campos
    id: 0,
    nombre: '',
    descripcion: '',
    categoria: null,
  };

  public showEditarServicioNotification = false;
  public showEditarServicioErrorNotification = false;

  constructor(private serviciosService: ServiciosService) { }

  ngOnInit(): void {
    this.serviciosService.getServicio(this.idServicio).subscribe(data => {
      this.servicio = data;
    },
      error => {
        console.log("Error al obtener el servicio: " + error);
      }
    );
  }

  editServicio() {
    this.serviciosService.editServicio(this.idServicio, this.servicio).subscribe(response => {
      console.log("El servicio se editó correctamente")
      this.servicio = {
        id: 0,
        nombre: '',
        descripcion: '',
        categoria: null,
      };
      this.ocultarModalEditarServicio();
      this.showEditarServicioNotification = true; // Mostrar la notificación
        setTimeout(() => {
        this.showEditarServicioNotification = false; // Ocultar la notificación después de 2 segundos
      }, 3000);
    },
      error => {
        this.showEditarServicioErrorNotification = true; // Mostrar la notificación
        setTimeout(() => {
        this.showEditarServicioErrorNotification = false; // Ocultar la notificación después de 2 segundos
      }, 3000);
      }
    )
  }

  ocultarModalEditarServicio() {
    this.editComplete.emit();
  }

}
