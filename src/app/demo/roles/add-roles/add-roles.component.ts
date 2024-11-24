import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Rol } from '../interfaces/rol.interface';
import { RolesService } from '../services/roles.service';
import { Permiso } from '../interfaces/permiso.interface';
import { PermisosService } from '../services/permisos.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-rol',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './add-roles.component.html',
  styleUrl: './add-roles.component.scss'
})
export class AddRolesComponent implements OnInit{

  public rol: Rol = {
    id: 0,
    nombre: "",
    descripcion: "",
    permisos: []
  }

  public permisos: Permiso[];

  constructor(
    private rolesService: RolesService,
    private permisosService: PermisosService,
    private dialogRef: MatDialogRef<AddRolesComponent>,
  ) { }

  ngOnInit(): void {
    this.permisosService.getAllPermisos().subscribe(data => {
      this.permisos = data;
    },
    error => {
      console.log("Error al obtener los permisos: " + error);
    })
  }

  onSubmit() {
    this.dialogRef.close(this.rol)
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
    this.dialogRef.close(null);
  }

}
