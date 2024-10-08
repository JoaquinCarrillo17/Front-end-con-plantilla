import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Habitacion } from '../interfaces/habitacion.interface';
import { Observable, tap } from 'rxjs';
import { Huesped } from '../../huespedes/interfaces/huesped.interface';

@Injectable({providedIn: 'root'})
export class HabitacionesService {

  private baseUrl : string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getHabitacionesDynamicFilterAnd(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/habitaciones/dynamicFilterAnd`, body);
  }

  getHabitacionesDynamicFilterOr(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/habitaciones/dynamicFilterOr`, body);
  }

  getAllHabitacionesMagicFilter() : Observable<{ habitaciones: Habitacion[], totalItems: number }> {
    return this.http.get<{ habitaciones: Habitacion[], totalItems: number }>(`${this.baseUrl}/habitaciones/magicFilter?pageNumber=0&itemsPerPage=5&valueSortOrder=ASC&sortBy=id`);
  }

  getHabitacionesFilteredByQuery(query: string, valueSortOrder: string, sortBy: string, page: number, items: number): Observable<{ habitaciones: Habitacion[], totalItems: number }> {
    const url = `${this.baseUrl}/habitaciones/magicFilter?query=${query}&valueSortOrder=${valueSortOrder}&sortBy=${sortBy}&pageNumber=${page}&itemsPerPage=${items}`;
    return this.http.get<{ habitaciones: Habitacion[], totalItems: number }>(url);
  }

  // ? INFO: Para el select de asociar huesped
  getAllHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(`${this.baseUrl}/habitaciones`);
  }

  // ? INFO: Para asociar un huesped a una habitacion
  addHuesped(idHabitacion: number, huesped: Huesped): Observable<any> {
    return this.http.post(`${this.baseUrl}/habitaciones/${idHabitacion}/huespedes`, huesped);
  }

  // ? INFO: Borrar habitacion
  deleteHabitacion(idHabitacion: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/habitaciones/${idHabitacion}`);
  }

  // ? INFO: Retorna la habitacion con todos sus campos (incluidos huespedes)
  getHabitacionFull(idHabitacion: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/habitaciones/${idHabitacion}/full`);
  }

  // ? INFO: Para editar una habitacion
  editHabitacion(idHabitacion: number, habitacion: Habitacion): Observable<any> {
    return this.http.put(`${this.baseUrl}/habitaciones/${idHabitacion}`, habitacion);
  }

  getHabitacion(idHabitacion: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/habitaciones/${idHabitacion}`);
  }

}
