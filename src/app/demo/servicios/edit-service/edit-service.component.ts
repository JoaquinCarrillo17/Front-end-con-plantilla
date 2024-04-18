import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Servicio } from '../interfaces/servicio.interface';
import { ServiciosService } from '../services/servicios.service';

@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
      window.location.reload(); // ? Recargo la pagina para mostrar los cambios
    },
      error => {
        console.error(`Error al editar el servicio` + error)
      }
    )
  }

  ocultarModalEditarServicio() {
    this.editComplete.emit();
  }

}
