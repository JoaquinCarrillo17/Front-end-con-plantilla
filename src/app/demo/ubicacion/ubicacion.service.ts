import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class UbicacionService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllUbicaciones(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ubicaciones/getActivas`);
  }

  getUbicacionesDynamicFilterOr(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ubicaciones/dynamicFilterOr`, body);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/ubicaciones/${id}`);
  }

  create(ubicacion: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ubicaciones`, ubicacion);
  }

  update(id: number, ubicacion: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/ubicaciones/${id}`, ubicacion);
  }


  /*getUbicacionesActivas(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ubicaciones/getActivas`);
  }
*/
}
