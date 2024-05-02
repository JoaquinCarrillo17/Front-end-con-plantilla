import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {

  public baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

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
