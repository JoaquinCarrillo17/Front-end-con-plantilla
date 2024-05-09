import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Usuario } from '../../pages/authentication/interfaces/usuario.interface';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UsuariosService {

  private baseUrl : string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllUsuariosMagicFilter() : Observable<{ usuarios: Usuario[], totalItems: number }> {
    return this.http.get<{ usuarios: Usuario[], totalItems: number }>(`${this.baseUrl}/usuarios/magicFilter?pageNumber=0&itemsPerPage=5&valueSortOrder=ASC&sortBy=id`);
  }

  getUsuariosFilteredByQuery(query: string, valueSortOrder: string, sortBy: string, page: number, items: number): Observable<{ usuarios: Usuario[], totalItems: number }> {
    const url = `${this.baseUrl}/usuarios/magicFilter?query=${query}&valueSortOrder=${valueSortOrder}&sortBy=${sortBy}&pageNumber=${page}&itemsPerPage=${items}`;
    return this.http.get<{ usuarios: Usuario[], totalItems: number }>(url);
  }

}
