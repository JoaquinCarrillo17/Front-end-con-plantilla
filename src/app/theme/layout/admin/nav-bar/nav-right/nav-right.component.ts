// angular import
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/demo/pages/authentication/interfaces/usuario.interface';
import { ProfileService } from 'src/app/demo/profile/services/profile.service';
import { TokenService } from 'src/app/demo/token/token.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
})
export class NavRightComponent implements OnInit {

  public username: string;
  public usuario: Usuario = {
    id: 0,
    nombre: "",
    username: "",
    email: "",
    password: "",
    fechaNacimiento: null,
  }

  public mostrarModalEditarPerfil = false;

  constructor(private tokenService: TokenService, private router: Router, private profileService: ProfileService) { }

  ngOnInit(): void {
    this.username = this.tokenService.getUsername();
    this.profileService.getUsuarioByUsername(this.username).subscribe(data => {
      this.usuario = data;
    },
      error => {
        console.log("Error al obtener el usuario: " + error);
      }
    );
  }

  logOut(): void {
    this.tokenService.setToken(null);
    this.router.navigate(['/auth/login']);
  }

  editUsuario() {
    this.profileService.editUsuario(this.usuario.id, this.usuario).subscribe(response => {
      console.log("El usuario se editó correctamente");
      this.profileService.getUsuarioByUsername(this.username).subscribe(data => {
        this.usuario = data;
      });
      this.ocultarModal();
    },
      error => {
        console.error(`Error al editar la huesped` + error)
      }
    );
  }

  mostrarModal() {
    this.mostrarModalEditarPerfil = true;
  }

  ocultarModal() {
    this.mostrarModalEditarPerfil = false;
  }


}
