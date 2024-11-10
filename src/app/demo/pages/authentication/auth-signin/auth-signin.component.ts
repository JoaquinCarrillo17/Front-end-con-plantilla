import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TokenService } from 'src/app/demo/token/token.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss'],
})
export  class AuthSigninComponent {

  @ViewChild('loginForm') loginForm: NgForm;

  constructor(private authService: AuthService, private router: Router, private tokenService: TokenService, private route: ActivatedRoute) {
   }

  login() {
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      (response: any) => {
      console.log('Response:', response);
      const token = response;
      //Navegar a localhost:4200/hotel-chart
      this.tokenService.setToken(token);
      const usuario = this.tokenService.getIdUsuario();
      const username = this.tokenService.getUsername();
      localStorage.setItem('superadmin', this.tokenService.esSuperAdmin() ? 'true' : 'false');
      localStorage.setItem('usuario', usuario);
      const redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl');
      if (redirectUrl) {
        this.router.navigateByUrl(redirectUrl);
      } else if (username.includes('admin')) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']); // Ruta por defecto si no hay redirectUrl
      }

    },
      error => {
        console.error('Login failed:', error);
        // Aquí puedes manejar el error como desees
      }
    );
  }

}
