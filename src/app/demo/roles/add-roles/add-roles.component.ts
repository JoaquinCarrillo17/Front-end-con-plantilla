import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Rol } from '../interfaces/rol.interface';
import { RolesService } from '../services/roles.service';
import { Permiso } from '../interfaces/permiso.interface';
import { PermisosService } from '../services/permisos.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-add-rol',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './add-roles.component.html',
  styleUrl: './add-roles.component.scss'
})
export class AddRolesComponent implements OnInit{

  @Output() cancelarCrear: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('nombreInput') nombreInput: { nativeElement: { value: string; }; };
  @ViewChild('descripcionInput') descripcionInput: { nativeElement: { value: string; }; };

  public showCrearRolNotification = false;
  public showCrearRolErrorNotification = false;

  public rol: Rol = {
    id: 0,
    nombre: "",
    descripcion: "",
    permisos: []
  }

  public permisos: Permiso[];

  constructor(private rolesService: RolesService, private permisosService: PermisosService) { }

  ngOnInit(): void {
    this.permisosService.getAllPermisos().subscribe(data => {
      this.permisos = data;
    },
    error => {
      console.log("Error al obtener los permisos: " + error);
    })
  }

  onSubmit() {

    const nombre = this.nombreInput.nativeElement.value;
    const descripcion = this.descripcionInput.nativeElement.value;

    this.rol = {
      nombre: nombre,
      descripcion: descripcion,
      permisos: this.rol.permisos
    }

    this.rolesService.addRol(this.rol).subscribe(response => {
      this.showCrearRolNotification = true; // Mostrar la notificación
      setTimeout(() => {
        this.showCrearRolNotification = false; // Ocultar la notificación después de 2 segundos
      }, 3000);
    }, error => {
      this.showCrearRolErrorNotification = true; // Mostrar la notificación
      setTimeout(() => {
        this.showCrearRolErrorNotification = false; // Ocultar la notificación después de 2 segundos
      }, 3000);
    })

  }

  rolTienePermiso(permiso: Permiso): boolean {
    return this.rol.permisos.some(p => p.id === permiso.id);
  }

  anadirPermiso(permiso: Permiso): void {
    const index = this.rol.permisos.findIndex(p => p.id === permiso.id);
    if (index !== -1) {
      // Si el permiso ya está en la lista, lo eliminamos
      this.rol.permisos.splice(index, 1);
    } else {
      // Si el permiso no está en la lista, lo agregamos
      this.rol.permisos.push(permiso);
    }
  }

  ocultarModalCrearRol() {
    this.cancelarCrear.emit();
  }

}
