import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Usuario } from '../../pages/authentication/interfaces/usuario.interface';
import { Rol } from '../../roles/interfaces/rol.interface';
import { RolesService } from '../../roles/services/roles.service';
import { UsuariosService } from '../services/usuarios.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule, SharedModule],
  templateUrl: './edit-usuario.component.html',
  styleUrl: './edit-usuario.component.scss'
})
export class EditUsuarioComponent implements OnInit {

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
    private dialogRef: MatDialogRef<EditUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario
  ) {
    this.usuario = { ...data };
  }

  ngOnInit(): void {
    this.rolesService.getAllRoles().subscribe(data => {
      this.roles = data;
    },
      error => {
        console.log("Error al obtener los roles: " + error);
      })
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

  onSubmit(): void {
    this.dialogRef.close(this.usuario); // Devolver el usuario editado
  }

  cancelar(): void {
    this.dialogRef.close(null); // Cerrar sin acción
  }

}
