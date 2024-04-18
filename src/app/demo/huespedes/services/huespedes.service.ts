import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Huesped } from '../interfaces/huesped.interface';
import { Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class HuespedesService {

  private baseUrl : string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllHuespedes(page?: number, items?: number) : Observable<{ huespedes: Huesped[], totalItems: number }> {
    return this.http.get<{ huespedes: Huesped[], totalItems: number }>(`${this.baseUrl}/huespedes/magicFilter?pageNumber=${page || 0}&itemsPerPage=${items || 5}`).pipe(
      tap(huespedes => console.log(huespedes)) // Loggea los huespedes emitidos por el observable
    );
  }

  getHuespedesFilteredByQuery(query: string, page?: number, items?: number): Observable<{ huespedes: Huesped[], totalItems: number }> {
    return this.http.get<{ huespedes: Huesped[], totalItems: number }>(`${this.baseUrl}/huespedes/magicFilter?query=${ query }&pageNumber=${page || 0}&itemsPerPage=${items || 5}`).pipe(
      tap(huespedes => console.log(huespedes))
    );
  }

  // ? INFO: Borrar Huesped
  deleteHuesped(idHuesped: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/huespedes/${idHuesped}`);
  }

  // ? INFO: Retorna la Huesped con todos sus campos (incluidos huespedes)
  getHuesped(idHuesped: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/huespedes/${idHuesped}`);
  }

  // ? INFO: Para editar una Huesped
  editHuesped(idHuesped: number, huesped: Huesped): Observable<any> {
    return this.http.put(`${this.baseUrl}/huespedes/${idHuesped}`, huesped);
  }

}
