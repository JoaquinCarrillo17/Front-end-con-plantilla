import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../interfaces/usuario.interface';
import { FormsModule, NgForm } from '@angular/forms';
import { TokenService } from 'src/app/demo/token/token.service';
import { SharedModule } from '../../../../theme/shared/shared.module';

@Component({
  selector: 'app-auth-signup',
  standalone: true,
  imports: [RouterModule, FormsModule, SharedModule],
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss'],
})
export class AuthSignupComponent implements OnInit {
  @ViewChild('signupForm') signupForm: NgForm;

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
  }

  signUp(): void {
    if (this.signupForm.invalid) {
      this.signupForm.form.markAllAsTouched();
      return;
    }

    const usuario: Usuario = {
      nombre: this.signupForm.value.nombre,
      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      fechaNacimiento: this.signupForm.value.fechaNacimiento,
    };

    this.authService.signUp(usuario).subscribe(
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
        this.message = 'Error al registrarse. Verifica los datos ingresados.';
        this.color = false;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      },
    );
  }
}
