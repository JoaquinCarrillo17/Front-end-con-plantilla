import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Rol } from '../interfaces/rol.interface';

@Injectable({providedIn: 'root'})
export class RolesService {

  private baseUrl : string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllRolesMagicFilter() : Observable<{ roles: Rol[], totalItems: number }> {
    return this.http.get<{ roles: Rol[], totalItems: number }>(`${this.baseUrl}/roles/magicFilter?pageNumber=0&itemsPerPage=5&valueSortOrder=ASC&sortBy=id`);
  }

  getRolesFilteredByQuery(query: string, valueSortOrder: string, sortBy: string, page: number, items: number): Observable<{ roles: Rol[], totalItems: number }> {
    const url = `${this.baseUrl}/roles/magicFilter?query=${query}&valueSortOrder=${valueSortOrder}&sortBy=${sortBy}&pageNumber=${page}&itemsPerPage=${items}`;
    return this.http.get<{ roles: Rol[], totalItems: number }>(url);
  }

}
