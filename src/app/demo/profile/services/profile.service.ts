import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../pages/authentication/interfaces/usuario.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class ProfileService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getUsuarioByUsername(username: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/usuarios/getUsuarioByUsername?username=${username}`);
  }

  editUsuario(idUsuario: number, usuario: Usuario): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuarios/${idUsuario}`, usuario);
  }

}
