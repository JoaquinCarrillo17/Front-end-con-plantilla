import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Historico } from '../interfaces/historico.interface';

@Injectable({providedIn: 'root'})
export class HistoricoService {

  public baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllHistoricos(id:any): Observable<Historico[]> {
    return this.http.get<Historico[]>(`${this.baseUrl}/historicos/admin/${id}`);
  }

  getHistoricosDeUsuario(id: any): Observable<Historico[]> {
    return this.http.get<Historico[]>(`${this.baseUrl}/historicos/${id}`)
  }

  getEstadisticas(hotelId: number | null, year: number): Observable<any> {
    const params: any = { year };
    if (hotelId !== null) {
      params.hotelId = hotelId;
    }
    return this.http.get(`${this.baseUrl}/historicos/getHistorico`, { params });
  }


}
