import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Hotel } from '../interfaces/hotel.interface';
import { Observable, tap } from 'rxjs';
import { Servicio } from '../../servicios/interfaces/servicio.interface';
import { Habitacion } from '../../habitaciones/interfaces/habitacion.interface';


@Injectable({ providedIn: 'root' })
export class HotelesService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllHotelesMagicFilter(page?: number, items?: number): Observable<{ hoteles: Hotel[], totalItems: number }> {
    return this.http.get<{ hoteles: Hotel[], totalItems: number }>(`${this.baseUrl}/hoteles/magicFilter?pageNumber=${page || 0}&itemsPerPage=${items || 5}`);
  }

  getHotelesFilteredByQuery(query: string, page?: number, items?: number): Observable<{ hoteles: Hotel[], totalItems: number }> {
    return this.http.get<{ hoteles: Hotel[], totalItems: number }>(`${this.baseUrl}/hoteles/magicFilter?query=${query}&pageNumber=${page || 0}&itemsPerPage=${items || 5}`);
  }

  // ? INFO: Para el select de añadir servicio
  getAllHoteles(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.baseUrl}/hoteles`);
  }

  // ? INFO: Para asociar un servicio al hotel
  addServicio(idHotel: number, servicio: Servicio): Observable<any> {
    return this.http.post(`${this.baseUrl}/hoteles/${idHotel}/servicios`, servicio);
  }

  // ? INFO: Para asociar una habitacion al hotel
  addHabitacion(idHotel: number, habitacion: Habitacion): Observable<any> {
    return this.http.post(`${this.baseUrl}/hoteles/${idHotel}/habitaciones`, habitacion);
  }

}
