import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Huesped } from '../interfaces/huesped.interface';
import { Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class HuespedesService {

  private baseUrl : string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getHuespedesDynamicFilterAnd(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/habitaciones/dynamicFilterAnd`, body);
  }

  getHuespedesDynamicFilterOr(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/huespedes/dynamicFilterOr`, body);
  }

  getAllHuespedesMagicFilter() : Observable<{ huespedes: Huesped[], totalItems: number }> {
    return this.http.get<{ huespedes: Huesped[], totalItems: number }>(`${this.baseUrl}/huespedes/magicFilter?pageNumber=0&itemsPerPage=5&valueSortOrder=ASC&sortBy=id`);
  }

  getHuespedesFilteredByQuery(query: string, valueSortOrder: string, sortBy: string, page: number, items: number): Observable<{ huespedes: Huesped[], totalItems: number }> {
    const url = `${this.baseUrl}/huespedes/magicFilter?query=${query}&valueSortOrder=${valueSortOrder}&sortBy=${sortBy}&pageNumber=${page}&itemsPerPage=${items}`;
    return this.http.get<{ huespedes: Huesped[], totalItems: number }>(url);
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
