import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Hotel } from '../interfaces/hotel.interface';
import { Observable, tap } from 'rxjs';


@Injectable({providedIn: 'root'})
export class HotelesService {

  private baseUrl : string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllHoteles(page?: number, items?: number) : Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.baseUrl}/hoteles/magicFilter?pageNumber=${page || 0}&itemsPerPage=${items || 5}`).pipe(
      tap(hoteles => console.log(hoteles)) // Loggea los hoteles emitidos por el observable
    );
  }

}
