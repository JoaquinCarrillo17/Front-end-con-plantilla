import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/demo/token/token.service';
import { SessionTimeoutModalService } from 'src/app/theme/shared/components/session-timeout-modal/services/timeout-modal.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public baseUrl = environment.baseUrl;

  private readonly ACTIVITY_TIMEOUT = 120000; //2 mins
  private readonly UPDATE_THRESHOLD = 30; // Umbral de tiempo en segundos para actualizar el token

  private activityTimer: any;
  private modalTimer: any;
  private isTokenRefreshing = false; // Bandera para evitar múltiples llamadas a createToken

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private tokenService: TokenService,
    private sessionTimeoutModalService: SessionTimeoutModalService,
  ) {}

  /*
   * Los tokens duran 10 mins, tengo un activity timeout de 10 mins
   * que mientras el usuario no pulse una tecla o mueva el raton se va consumiendo,
   * si se consume te llevo al login. Sin embargo, si el usuario esta activo,
   * cada vez que use el teclado o mueva el raton se reseteara ese timeout,
   * de forma que mientras este activo nunca te lleve al login y por lo tanto sigas autenticado
   * */

  startActivityDetection(): void {
    window.addEventListener('mousemove', this.resetActivityTimer.bind(this));
    window.addEventListener('keypress', this.resetActivityTimer.bind(this));
    this.resetActivityTimer();
  }

  resetActivityTimer(): void {
    clearTimeout(this.activityTimer);
    clearTimeout(this.modalTimer);

    this.activityTimer = setTimeout(() => {
      // Token expired due to inactivity, redirect to login
      if (this.tokenService.getToken() != null) {
        this.tokenService.removeToken();
        this.closeSessionTimeoutModal();
        this.redirectToLogin();
      }
    }, this.ACTIVITY_TIMEOUT);

    this.modalTimer = setTimeout(
      () => {
        if (this.tokenService.getToken() != null)
          this.showSessionTimeoutModal();
      },
      this.ACTIVITY_TIMEOUT - this.UPDATE_THRESHOLD * 1000,
    );

    if (this.tokenService.getToken() != null) this.updateTokenExpiration();
  }

  showSessionTimeoutModal() {
    const token = this.tokenService.getToken();
    if (token) {
      this.sessionTimeoutModalService.showModal(true);
    }
  }

  closeSessionTimeoutModal() {
    this.sessionTimeoutModalService.showModal(false);
  }

  redirectToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  updateTokenExpiration(): void {
    const token = this.tokenService.getToken();
    if (token != null) {
      if (this.isTokenExpiringSoon(token)) {
        if (!this.isTokenRefreshing) {
          this.isTokenRefreshing = true; // Evitar múltiples llamadas

          const decodedToken = this.jwtHelper.decodeToken(token);
          if (decodedToken && decodedToken.sub) {
            const sub = decodedToken.sub;
            this.createToken(sub).subscribe(
              (updatedToken) => {
                this.tokenService.setToken(updatedToken);
                this.isTokenRefreshing = false;
              },
              (error) => {
                this.isTokenRefreshing = false; 
              },
            );
          }
        }
      }
    }
  }

  isTokenExpiringSoon(token: string): boolean {
    const expirationTimeInSeconds =
      this.jwtHelper.getTokenExpirationDate(token).getTime() / 1000;
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    return (
      expirationTimeInSeconds - currentTimeInSeconds <= this.UPDATE_THRESHOLD
    );
  }

  createToken(username: string): Observable<string> {
    const body = new FormData();
    body.append('username', username);

    const options = { responseType: 'text' as 'text' }; // ! sino pongo esto intenta analizar el token como JSON y da error

    return this.http.post(`${this.baseUrl}/auth/createToken`, body, options);
  }

  login(username: string, password: string): Observable<any> {
    const body = new FormData();
    body.append('username', username);
    body.append('password', password);

    const options = { responseType: 'text' as 'text' }; // ! sino pongo esto intenta analizar el token como JSON y da error

    return this.http.post(`${this.baseUrl}/auth/login`, body, options);
  }

  signUp(usuario: Usuario): Observable<any> {
    const options = { responseType: 'text' as 'text' }; // ! sino pongo esto intenta analizar el token como JSON y da error
    return this.http.post(`${this.baseUrl}/auth/signUp`, usuario, options);
  }
}
