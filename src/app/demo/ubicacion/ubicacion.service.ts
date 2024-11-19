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

  /*getUbicacionesActivas(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ubicaciones/getActivas`);
  }
*/
}
