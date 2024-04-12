import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servicio } from '../interfaces/servicio.interface';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class ServiciosService {

  private baseUrl : string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllServicios(page?: number, items?: number) : Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.baseUrl}/servicios/magicFilter?pageNumber=${page || 0}&itemsPerPage=${items || 5}`).pipe(
      tap(servicios => console.log(servicios)) // Loggea los servicios emitidos por el observable
    );
  }

}
