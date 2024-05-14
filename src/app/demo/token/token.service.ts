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

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

}
