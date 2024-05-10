import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Permiso } from '../interfaces/permiso.interface';

@Injectable({providedIn: 'root'})
export class PermisosService {

  private baseUrl : string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(`${this.baseUrl}/permisos`);
  }

}
