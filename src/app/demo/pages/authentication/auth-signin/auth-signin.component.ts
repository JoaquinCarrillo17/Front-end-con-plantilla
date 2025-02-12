import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TokenService } from 'src/app/demo/token/token.service';
import { AuthService } from '../services/auth.service';
import { SharedModule } from '../../../../theme/shared/shared.module';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule, FormsModule, SharedModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss'],
})
export class AuthSigninComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  showNotification: boolean = false;
  message: any;
  color: boolean = false;

  redirectUrl: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService,
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl');
    if (this.redirectUrl) {
      this.showNotification = true;
          this.message = 'Inicia sesión para realizar esta acción';
          this.color = false;
          setTimeout(() => {
            this.showNotification = false;
          }, 3000);
    }
  }

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

          if (this.redirectUrl) {
            this.router.navigateByUrl(this.redirectUrl);
          } else {
            const roles = this.tokenService.getRoles(); // Obtén los roles del usuario
            if (
              roles.includes('ROLE_HOTELES_W') ||
              roles.includes('ROLE_SUPER_ADMIN')
            ) {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']); // Ruta por defecto
            }
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

  goToSignUp() {
    const queryParams = this.redirectUrl
      ? { redirectUrl: this.redirectUrl }
      : {};
    this.router.navigate(['/auth/signup'], { queryParams });
  }
}
