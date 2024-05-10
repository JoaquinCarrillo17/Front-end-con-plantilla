import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Usuario } from '../../pages/authentication/interfaces/usuario.interface';
import { Rol } from '../../roles/interfaces/rol.interface';
import { RolesService } from '../../roles/services/roles.service';
import { UsuariosService } from '../services/usuarios.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-usuario.component.html',
  styleUrl: './edit-usuario.component.scss'
})
export class EditUsuarioComponent implements OnInit {

  @Input() idUsuario: number;
  @Output() editComplete: EventEmitter<void> = new EventEmitter<void>();

  public showEditarUsuarioNotification = false;
  public showEditarUsuarioErrorNotification = false;

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

  constructor(private rolesService: RolesService, private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.usuariosService.getUsuario(this.idUsuario).subscribe(data => {
      this.usuario = data;
    },
      error => {
        console.log("Error al obtener el usuario: " + error)
      })

    this.rolesService.getAllRoles().subscribe(data => {
      this.roles = data;
    },
      error => {
        console.log("Error al obtener los roles: " + error);
      })
  }

  editUsuario() {
    this.usuariosService.editUsuario(this.idUsuario, this.usuario).subscribe(response => {
      this.usuario = {
        id: 0,
        nombre: "",
        username: "",
        email: "",
        password: "",
        fechaNacimiento: null,
        roles: []
      }
      this.ocultarModalEditarUsuario();
      this.showEditarUsuarioNotification = true;
      setTimeout(() => {
        this.showEditarUsuarioNotification = false;
      }, 3000);
      window.location.reload();
    }, error => {
      this.showEditarUsuarioErrorNotification = true;
      setTimeout(() => {
        this.showEditarUsuarioErrorNotification = false;
      }, 3000);
    }
    )
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

  ocultarModalEditarUsuario() {
    this.editComplete.emit();
  }

}
