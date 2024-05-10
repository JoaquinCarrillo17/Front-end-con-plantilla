import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Rol } from '../interfaces/rol.interface';
import { RolesService } from '../services/roles.service';

@Component({
  selector: 'app-add-rol',
  standalone: true,
  imports: [],
  templateUrl: './add-roles.component.html',
  styleUrl: './add-roles.component.scss'
})
export class AddRolesComponent {

  @Output() cancelarCrear: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('nombreInput') nombreInput: { nativeElement: { value: string; }; };
  @ViewChild('descripcionInput') descripcionInput: { nativeElement: { value: string; }; };

  public showCrearRolNotification = false;
  public showCrearRolErrorNotification = false;

  public rol: Rol = {
    id: 0,
    nombre: "",
    descripcion: "",
    rolesIndirectos: []
  }

  constructor(private rolesService: RolesService) { }

  onSubmit() {

    const nombre = this.nombreInput.nativeElement.value;
    const descripcion = this.descripcionInput.nativeElement.value;

    this.rol = {
      nombre: nombre,
      descripcion: descripcion,
      rolesIndirectos: []
    }

    this.rolesService.addRol(this.rol).subscribe(response => {
      this.showCrearRolNotification = true; // Mostrar la notificación
      setTimeout(() => {
        this.showCrearRolNotification = false; // Ocultar la notificación después de 2 segundos
      }, 3000);
      window.location.reload();
    }, error => {
      this.showCrearRolErrorNotification = true; // Mostrar la notificación
      setTimeout(() => {
        this.showCrearRolErrorNotification = false; // Ocultar la notificación después de 2 segundos
      }, 3000);
    })

  }

  ocultarModalCrearRol() {
    this.cancelarCrear.emit();
  }

}
