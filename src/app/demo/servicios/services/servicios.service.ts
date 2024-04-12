import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Servicio } from '../interfaces/servicio.interface';
import { Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ServiciosService {

  private baseUrl : string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllServicios(page?: number, items?: number) : Observable<{ servicios: Servicio[], totalItems: number }> {
    return this.http.get<{ servicios: Servicio[], totalItems: number }>(`${this.baseUrl}/servicios/magicFilter?pageNumber=${page || 0}&itemsPerPage=${items || 5}`).pipe(
      tap(servicios => console.log(servicios)) // Loggea los servicios emitidos por el observable
    );
  }

  getServiciosFilteredByQuery(query: string, page?: number, items?: number): Observable<{ servicios: Servicio[], totalItems: number }> {
    return this.http.get<{ servicios: Servicio[], totalItems: number }>(`${this.baseUrl}/servicios/magicFilter?query=${ query }&pageNumber=${page || 0}&itemsPerPage=${items || 5}`).pipe(
      tap(servicios => console.log(servicios))
    );
  }

}
