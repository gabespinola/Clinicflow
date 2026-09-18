import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicoRequest, MedicoResponse } from '../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private readonly baseUrl = 'http://localhost:8080/medicos';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<MedicoResponse[]> {
    return this.http.get<MedicoResponse[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<MedicoResponse> {
    return this.http.get<MedicoResponse>(`${this.baseUrl}/${id}`);
  }

  criar(medico: MedicoRequest): Observable<MedicoResponse> {
    return this.http.post<MedicoResponse>(this.baseUrl, medico);
  }

  atualizar(id: number, medico: MedicoRequest): Observable<MedicoResponse> {
    return this.http.put<MedicoResponse>(`${this.baseUrl}/${id}`, medico);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}