import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Habitacion } from '../interfaces/habitacion.interface';
import { Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class HabitacionesService {

  private baseUrl : string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllHabitaciones(page?: number, items?: number) : Observable<{ habitaciones: Habitacion[], totalItems: number }> {
    return this.http.get<{ habitaciones: Habitacion[], totalItems: number }>(`${this.baseUrl}/habitaciones/magicFilter?pageNumber=${page || 0}&itemsPerPage=${items || 5}`).pipe(
      tap(habitaciones => console.log(habitaciones)) // Loggea las habitaciones emitidas por el observable
    );
  }

  getHabitacionesFilteredByQuery(query: string, page?: number, items?: number): Observable<{ habitaciones: Habitacion[], totalItems: number }> {
    return this.http.get<{ habitaciones: Habitacion[], totalItems: number }>(`${this.baseUrl}/habitaciones/magicFilter?query=${ query }&pageNumber=${page || 0}&itemsPerPage=${items || 5}`).pipe(
      tap(habitaciones => console.log(habitaciones))
    );
  }

}
