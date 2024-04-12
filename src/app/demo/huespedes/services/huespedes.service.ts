import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Huesped } from '../interfaces/huesped.interface';
import { Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class HuespedesService {

  private baseUrl : string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllHuespedes(page?: number, items?: number) : Observable<Huesped[]> {
    return this.http.get<Huesped[]>(`${this.baseUrl}/huespedes/magicFilter?pageNumber=${page || 0}&itemsPerPage=${items || 5}`).pipe(
      tap(huespedes => console.log(huespedes)) // Loggea los huespedes emitidos por el observable
    );
  }

  getHuespedesFilteredByQuery(query: string, page?: number, items?: number): Observable<Huesped[]> {
    return this.http.get<Huesped[]>(`${this.baseUrl}/huespedes/magicFilter?query=${ query }&pageNumber=${page || 0}&itemsPerPage=${items || 5}`).pipe(
      tap(huespedes => console.log(huespedes))
    );
  }

}

