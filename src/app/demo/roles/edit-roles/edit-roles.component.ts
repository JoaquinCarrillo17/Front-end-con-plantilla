import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { RolesService } from '../services/roles.service';
import { Rol } from '../interfaces/rol.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermisosService } from '../services/permisos.service';
import { Permiso } from '../interfaces/permiso.interface';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-rol',
  standalone: true,
  imports: [FormsModule, CommonModule, SharedModule],
  templateUrl: './edit-roles.component.html',
  styleUrl: './edit-roles.component.scss'
})
export class EditRolesComponent implements OnInit {

  public rol: Rol = {
    id: 0,
    nombre: "",
    descripcion: "",
    permisos: []
  }

  public permisos: Permiso[];


  constructor(
    private dialogRef: MatDialogRef<EditRolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rol: Rol },
    private permisosService: PermisosService
  ) {
    this.rol = { ...data.rol }; // Clonar el rol para evitar modificar el original directamente
  }

  ngOnInit(): void {

    this.permisosService.getAllPermisos().subscribe(data => {
      this.permisos = data;
    },
    error => {
      console.log("Error al obtener los permisos: " + error);
    })
  }

  editRol() {
    this.dialogRef.close(this.rol);
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
    this.dialogRef.close(null);
  }

}
