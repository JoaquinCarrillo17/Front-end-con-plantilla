import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Usuario } from '../../pages/authentication/interfaces/usuario.interface';
import { Rol } from '../../roles/interfaces/rol.interface';
import { UsuariosService } from '../services/usuarios.service';
import { RolesService } from '../../roles/services/roles.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-usuario',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './add-usuario.component.html',
  styleUrl: './add-usuario.component.scss'
})
export class AddUsuarioComponent implements OnInit {

  public usuario: Usuario = {
    id: 0,
    nombre: "",
    username: "",
    email: "",
    password: "",
    fechaNacimiento: null,
    roles: []
  }

  public roles: Rol[];

  constructor(
    private rolesService: RolesService,
    private usuariosService: UsuariosService,
    private dialogRef: MatDialogRef<AddUsuarioComponent>
  ) { }

  ngOnInit(): void {
    this.rolesService.getAllRoles().subscribe(data => {
      this.roles = data;
    },
      error => {
        console.log("Error al obtener los roles: " + error);
      })
  }

  onSubmit() {
    this.dialogRef.close(this.usuario);
  }

  usuarioTieneRol(rol: Rol): boolean {
    return this.usuario.roles.some(u => u.id === rol.id);
  }

  anadirRol(rol: Rol): void {
    const index = this.usuario.roles.findIndex(u => u.id === rol.id);
    if (index !== -1) {
      // Si el permiso ya está en la lista, lo eliminamos
      this.usuario.roles.splice(index, 1);
    } else {
      // Si el permiso no está en la lista, lo agregamos
      this.usuario.roles.push(rol);
    }
  }

  cancelar(): void {
    this.dialogRef.close(null); // Cerrar sin acción
  }



}
