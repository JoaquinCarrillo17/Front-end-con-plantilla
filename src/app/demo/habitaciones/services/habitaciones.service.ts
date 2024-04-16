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

  getAllHabitacionesMagicFilter(page?: number, items?: number) : Observable<{ habitaciones: Habitacion[], totalItems: number }> {
    return this.http.get<{ habitaciones: Habitacion[], totalItems: number }>(`${this.baseUrl}/habitaciones/magicFilter?pageNumber=${page || 0}&itemsPerPage=${items || 5}`).pipe(
      tap(habitaciones => console.log(habitaciones)) // Loggea las habitaciones emitidas por el observable
    );
  }

  getHabitacionesFilteredByQuery(query: string, page?: number, items?: number): Observable<{ habitaciones: Habitacion[], totalItems: number }> {
    return this.http.get<{ habitaciones: Habitacion[], totalItems: number }>(`${this.baseUrl}/habitaciones/magicFilter?query=${ query }&pageNumber=${page || 0}&itemsPerPage=${items || 5}`).pipe(
      tap(habitaciones => console.log(habitaciones))
    );
  }

  // ? INFO: Para el select de asociar huesped
  getAllHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(`${this.baseUrl}/habitaciones`);
  }

  // ? INFO: Para asociar un huesped a una habitacion
  addHuesped(idHabitacion: number, huesped: Huesped): Observable<any> {
    return this.http.post(`${this.baseUrl}/habitaciones/${idHabitacion}/huespedes`, huesped);
  }

}
