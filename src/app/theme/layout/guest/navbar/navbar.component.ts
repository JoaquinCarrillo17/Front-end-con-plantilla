import { CommonModule, Location } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from '@angular/router';
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { ProfileService } from "src/app/demo/profile/services/profile.service";
import { TokenService } from "src/app/demo/token/token.service";
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {

  showDropdown = false;
  public username: string;
  public usuario: any = {
    id: 0,
    nombre: "",
    username: "",
    email: "",
    password: "",
    fechaNacimiento: null,
  }

  public mostrarModalEditarPerfil = false;
  public showNotification = false;
  message: any;
  color: boolean = false;

  toggleDropdown() {
    if (localStorage.getItem('auth_token') === null) {
      this.goToLogin()
    } else this.showDropdown = !this.showDropdown;
  }

  constructor(
    private router: Router,
    private location: Location,
    private tokenService: TokenService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('auth_token') !== null) {
      this.username = this.tokenService.getUsername();
      this.profileService.getUsuarioByUsername(this.username).subscribe(data => {
        this.usuario = data;
      },
        error => {
          console.log("Error al obtener el usuario: " + error);
        }
      );
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  logOut() {
    this.tokenService.removeToken();
    this.showDropdown = false;

    this.router.navigate(['/']).then(() => {
      console.log(this.location.path())
      if (this.location.path() === '') {
        window.location.reload();
      }
    });
  }

  editUsuario() {
    this.profileService.editUsuario(this.usuario.id, this.usuario).subscribe(response => {
      this.ocultarModal();
      this.showNotification = true;
        this.message = 'Operación realizada con éxito';
        this.color = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
    },
      error => {
        this.showNotification = true;
        this.message = 'Error al realizar la operación';
        this.color = false;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      }
    );
  }

  mostrarModal() {
    this.mostrarModalEditarPerfil = true;
    this.showDropdown = !this.showDropdown;
  }

  ocultarModal() {
    this.mostrarModalEditarPerfil = false;
  }

  goToReservas() {
    if (localStorage.getItem('auth_token') == null) {
      this.router.navigate(['/auth/login'], {
        queryParams: { redirectUrl: '/reservas' },
      });
    } else this.router.navigate(['/reservas']);
  }

}
