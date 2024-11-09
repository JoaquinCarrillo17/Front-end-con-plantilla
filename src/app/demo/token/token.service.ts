import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private tokenKey = 'auth_token';

  constructor(private jwtHelper: JwtHelperService) {}

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getRoles(): string[] {
    const decodedToken = this.jwtHelper.decodeToken(this.getToken());
    return decodedToken ? decodedToken.roles : [];
  }

  getUsername(): string {
    const decodedToken = this.jwtHelper.decodeToken(this.getToken());
    return decodedToken ? decodedToken.sub : '';
  }

  getIdUsuario(): string {
    const decodedToken = this.jwtHelper.decodeToken(this.getToken());
    return decodedToken && decodedToken.id ? decodedToken.id : null;
  }

  esSuperAdmin(): boolean {
    return this.getRoles().includes('ROLE_SUPER_ADMIN');
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
  }
}
