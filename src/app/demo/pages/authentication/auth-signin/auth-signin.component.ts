import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from 'src/app/demo/token/token.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss'],
})
export default class AuthSigninComponent {

  @ViewChild('loginForm') loginForm: NgForm;

  constructor(private authService: AuthService, private router: Router, private tokenService: TokenService) {
   }

  login() {
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
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
        console.error('Login failed:', error);
        // Aquí puedes manejar el error como desees
      }
    );
  }

}
