import { Component, Inject, OnInit } from '@angular/core';
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
    nombre: '',
    descripcion: '',
    permisos: []
  };

  public permisos: Permiso[];

  constructor(
    private dialogRef: MatDialogRef<EditRolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rol: Rol },
    private permisosService: PermisosService
  ) {
    // Clonar el rol y la lista de permisos para evitar referencias directas
    this.rol = {
      ...data.rol,
      permisos: [...(data.rol.permisos || [])] // Copia profunda del array de permisos
    };
  }

  ngOnInit(): void {
    this.permisosService.getAllPermisos().subscribe(
      (data) => {
        this.permisos = data;
      },
      (error) => {
        console.log('Error al obtener los permisos: ' + error);
      }
    );
  }

  editRol() {
    this.dialogRef.close(this.rol); // Devolver los datos editados
  }

  rolTienePermiso(permiso: Permiso): boolean {
    return this.rol.permisos.some((p) => p.id === permiso.id);
  }

  anadirPermiso(permiso: Permiso): void {
    const permisosCopy = [...this.rol.permisos]; // Trabajar con una copia
    const index = permisosCopy.findIndex((p) => p.id === permiso.id);

    if (index !== -1) {
      permisosCopy.splice(index, 1); // Eliminar permiso
    } else {
      permisosCopy.push(permiso); // Añadir permiso
    }

    this.rol.permisos = permisosCopy; // Actualizar el array
  }

  ocultarModalEditarRol() {
    this.dialogRef.close(null);
  }
}
