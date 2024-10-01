import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({providedIn: 'root'})
export class TokenService {

  private token: string;

  constructor( private jwtHelper: JwtHelperService ) { }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  getRoles(): string[] {
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    return decodedToken ? decodedToken.roles : [];
  }

  getUsername(): string {
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    return decodedToken ? decodedToken.sub : "";
  }

  getIdUsuario(): string {
    if (this.token) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      if (decodedToken && decodedToken.id) {
        return decodedToken.id;
      }
    }
    return null;
  }

  esSuperAdmin(): boolean {
    if (this.token) {
      return this.getRoles().includes('ROLE_SUPER_ADMIN');
    }
    return false;
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

}
