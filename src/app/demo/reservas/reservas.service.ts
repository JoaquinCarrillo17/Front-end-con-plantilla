import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class ReservasService {

  private baseUrl : string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  createReserva(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reservas`, body);
  }

  dynamicSearch(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reservas/dynamicFilterOr`, body);
  }

  getReservasDynamicFilterOr(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reservas/dynamicFilterOr`, body);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reservas/${id}`);
  }

}
