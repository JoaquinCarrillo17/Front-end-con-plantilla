import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Usuario } from '../../pages/authentication/interfaces/usuario.interface';
import { Rol } from '../../roles/interfaces/rol.interface';
import { UsuariosService } from '../services/usuarios.service';
import { RolesService } from '../../roles/services/roles.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-usuario.component.html',
  styleUrl: './add-usuario.component.scss'
})
export class AddUsuarioComponent implements OnInit {

  @Output() cancelarCrear: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('nombreInput') nombreInput: { nativeElement: { value: string; }; };
  @ViewChild('usernameInput') usernameInput: { nativeElement: { value: string; }; };
  @ViewChild('emailInput') emailInput: { nativeElement: { value: string; }; };
  @ViewChild('passwordInput') passwordInput: { nativeElement: { value: string; }; };
  @ViewChild('fechaInput') fechaInput: { nativeElement: { value: Date; }; };

  public showCrearUsuarioNotification = false;
  public showCrearUsuarioErrorNotification = false;

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
    this.rolesService.getAllRoles().subscribe(data => {
      this.roles = data;
    },
      error => {
        console.log("Error al obtener los roles: " + error);
      })
  }

  onSubmit() {

    const nombre = this.nombreInput.nativeElement.value;
    const username = this.usernameInput.nativeElement.value;
    const email = this.emailInput.nativeElement.value;
    const password = this.passwordInput.nativeElement.value;
    const fechaNacimiento = this.fechaInput.nativeElement.value;

    this.usuario = {
      nombre: nombre,
      username: username,
      email: email,
      password: password,
      fechaNacimiento: fechaNacimiento,
      roles: this.usuario.roles
    }

    this.usuariosService.addUsuario(this.usuario).subscribe(response => {
      this.ocultarModalCrearUsuario();
      this.showCrearUsuarioNotification = true; // Mostrar la notificación
      setTimeout(() => {
        this.showCrearUsuarioNotification = false; // Ocultar la notificación después de 2 segundos
      }, 3000);
    }, error => {
      this.showCrearUsuarioErrorNotification = true; // Mostrar la notificación
      setTimeout(() => {
        this.showCrearUsuarioErrorNotification = false; // Ocultar la notificación después de 2 segundos
      }, 3000);
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

  ocultarModalCrearUsuario() {
    this.cancelarCrear.emit();
  }



}
