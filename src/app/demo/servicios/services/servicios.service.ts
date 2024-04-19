import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Servicio } from '../interfaces/servicio.interface';
import { Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ServiciosService {

  private baseUrl : string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllServiciosMagicFilter() : Observable<{ servicios: Servicio[], totalItems: number }> {
    return this.http.get<{ servicios: Servicio[], totalItems: number }>(`${this.baseUrl}/servicios/magicFilter?pageNumber=0&itemsPerPage=5&valueSortOrder=ASC&sortBy=id`);
  }

  getServiciosFilteredByQuery(query: string, valueSortOrder: string, sortBy: string, page: number, items: number): Observable<{ servicios: Servicio[], totalItems: number }> {
    const url = `${this.baseUrl}/servicios/magicFilter?query=${query}&valueSortOrder=${valueSortOrder}&sortBy=${sortBy}&pageNumber=${page}&itemsPerPage=${items}`;
    return this.http.get<{ servicios: Servicio[], totalItems: number }>(url);
  }

  // ? INFO: Borrar Servicio
  deleteServicio(idServicio: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/servicios/${idServicio}`);
  }

  // ? INFO: Retorna la Servicio con todos sus campos (incluidos Servicioes)
  getServicio(idServicio: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/servicios/${idServicio}`);
  }

  // ? INFO: Para editar una Servicio
  editServicio(idServicio: number, servicio: Servicio): Observable<any> {
    return this.http.put(`${this.baseUrl}/servicios/${idServicio}`, servicio);
  }

}
