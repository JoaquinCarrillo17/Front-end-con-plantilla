import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RolesService } from '../services/roles.service';
import { Rol } from '../interfaces/rol.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermisosService } from '../services/permisos.service';
import { Permiso } from '../interfaces/permiso.interface';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-edit-rol',
  standalone: true,
  imports: [FormsModule, CommonModule, SharedModule],
  templateUrl: './edit-roles.component.html',
  styleUrl: './edit-roles.component.scss'
})
export class EditRolesComponent implements OnInit {

  @Input() idRol: number;
  @Output() editComplete: EventEmitter<void> = new EventEmitter<void>();
  public rol: Rol = {
    id: 0,
    nombre: "",
    descripcion: "",
    permisos: []
  }

  public permisos: Permiso[];

  public showEditarRolNotification = false;
  public showEditarRolErrorNotification = false;

  constructor(private rolesService: RolesService, private permisosService: PermisosService) { }

  ngOnInit(): void {
    this.rolesService.getRol(this.idRol).subscribe(data => {
      this.rol = data;
    },
      error => {
        console.log("Error al obtener el rol: " + error)
      })

    this.permisosService.getAllPermisos().subscribe(data => {
      this.permisos = data;
    },
    error => {
      console.log("Error al obtener los permisos: " + error);
    })
  }

  editRol() {
    this.rolesService.editRol(this.idRol, this.rol).subscribe(response => {
      this.rol = {
        id: 0,
        nombre: "",
        descripcion: "",
        permisos: []
      }
      this.ocultarModalEditarRol();
      this.showEditarRolNotification = true;
      setTimeout(() => {
        this.showEditarRolNotification = false;
      }, 3000);
    }, error => {
      this.showEditarRolErrorNotification = true;
      setTimeout(() => {
        this.showEditarRolErrorNotification = false;
      }, 3000);
    }
  )
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

  ocultarModalEditarRol() {
    this.editComplete.emit();
  }

}
