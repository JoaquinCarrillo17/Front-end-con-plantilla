import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../interfaces/usuario.interface';
import { FormsModule, NgForm } from '@angular/forms';
import { TokenService } from 'src/app/demo/token/token.service';

@Component({
  selector: 'app-auth-signup',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss'],
})
export default class AuthSignupComponent {

  @ViewChild('signupForm') signupForm: NgForm;

  constructor(private authService: AuthService, private router: Router, private tokenService: TokenService) {}

  signUp(): void {
    const usuario: Usuario = {
      nombre: this.signupForm.value.nombre,
      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      fechaNacimiento: this.signupForm.value.fechaNacimiento
    };

    this.authService.signUp(usuario).subscribe(
      (response: any) => {
        console.log('Response:', response);
        const token = response;
        //Navegar a localhost:4200/hotel-chart
        this.tokenService.setToken(token);
        const usuario = this.authService.getIdUsuario();
        localStorage.setItem('usuario', usuario);
        this.router.navigate(['/hotel-chart']);
      },
      error => {
        console.error('Sign up failed:', error);
        // Aquí puedes manejar el error como desees
      }
    );
  }

}
