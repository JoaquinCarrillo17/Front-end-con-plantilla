import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Hotel } from '../interfaces/hotel.interface';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class HotelesService {

  private baseUrl : string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllHoteles() : Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${ this.baseUrl }/hoteles`);
  }

}
