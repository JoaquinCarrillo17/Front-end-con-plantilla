import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TokenService } from 'src/app/demo/token/token.service';
import { AuthService } from '../services/auth.service';
import { SharedModule } from "../../../../theme/shared/shared.module";

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule, FormsModule, SharedModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss'],
})
export class AuthSigninComponent {
  @ViewChild('loginForm') loginForm: NgForm;
  showNotification: boolean = false;
  message: any;
  color: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService,
    private route: ActivatedRoute,
  ) {}

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.form.markAllAsTouched();
      return;
    }
    this.authService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe(
        (response: any) => {
          const token = response;
          this.tokenService.setToken(token);
          const usuario = this.tokenService.getIdUsuario();
          const username = this.tokenService.getUsername();
          localStorage.setItem(
            'superadmin',
            this.tokenService.esSuperAdmin() ? 'true' : 'false',
          );
          localStorage.setItem('usuario', usuario);
          const redirectUrl =
            this.route.snapshot.queryParamMap.get('redirectUrl');
          if (redirectUrl) {
            this.router.navigateByUrl(redirectUrl);
          } else if (username.includes('admin')) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']); // Ruta por defecto si no hay redirectUrl
          }
        },
        (error) => {
          this.showNotification = true;
          this.message = 'Usuario o contraseña incorrectos';
          this.color = false;
          setTimeout(() => {
            this.showNotification = false;
          }, 3000);
        },
      );
  }
}
