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

  getHotelesDynamicFilterAnd(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/hoteles/dynamicFilterAnd`, body);
  }

  getHotelesDynamicFilterOr(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/hoteles/dynamicFilterOr`, body);
  }

  getAllHotelesMagicFilter(): Observable<{ hoteles: Hotel[], totalItems: number }> {
    return this.http.get<{ hoteles: Hotel[], totalItems: number }>(`${this.baseUrl}/hoteles/magicFilter?pageNumber=0&itemsPerPage=5&valueSortOrder=ASC&sortBy=id`);
  }

  getHotelesFilteredByQuery(query: string, valueSortOrder: string, sortBy: string, page: number, items: number): Observable<{ hoteles: Hotel[], totalItems: number }> {
    const url = `${this.baseUrl}/hoteles/magicFilter?query=${query}&valueSortOrder=${valueSortOrder}&sortBy=${sortBy}&pageNumber=${page}&itemsPerPage=${items}`;
    return this.http.get<{ hoteles: Hotel[], totalItems: number }>(url);
  }

  // ? INFO: Para el select de asociar servicio
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

  // ? INFO: Para crear un hotel
  addHotel(hotel: Hotel): Observable<any> {
    return this.http.post(`${this.baseUrl}/hoteles`, hotel);
  }

  // ? INFO: Para borrar un hotel
  deleteHotel(idHotel: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/hoteles/${idHotel}`);
  }

  // ? INFO: Retorna el hotel con todos sus campos (incluidos servicios y habitaciones)
  getHotelFull(idHotel: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/hoteles/${idHotel}/full`);
  }

  // ? INFO: Para editar un hotel
  editHotel(idHotel: number, hotel: Hotel): Observable<any> {
    return this.http.put(`${this.baseUrl}/hoteles/${idHotel}`, hotel);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/hoteles/${id}`);
  }

  getHotelPorUsuario(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/hoteles/getHotelByUsuario/${id}`);
  }

}
