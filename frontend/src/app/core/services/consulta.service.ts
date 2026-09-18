import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConsultaRequest, ConsultaResponse } from '../models/consulta.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private readonly baseUrl = 'http://localhost:8080/consultas';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<ConsultaResponse[]> {
    return this.http.get<ConsultaResponse[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<ConsultaResponse> {
    return this.http.get<ConsultaResponse>(`${this.baseUrl}/${id}`);
  }

  criar(consulta: ConsultaRequest): Observable<ConsultaResponse> {
    return this.http.post<ConsultaResponse>(this.baseUrl, consulta);
  }

  atualizar(id: number, consulta: ConsultaRequest): Observable<ConsultaResponse> {
    return this.http.put<ConsultaResponse>(`${this.baseUrl}/${id}`, consulta);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}