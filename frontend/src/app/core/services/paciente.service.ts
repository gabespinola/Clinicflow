import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PacienteRequest, PacienteResponse } from '../models/paciente.model';
import { ResumoIaResponse } from '../models/resumo-ia.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private readonly baseUrl = 'http://localhost:8080/pacientes';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<PacienteResponse[]> {
    return this.http.get<PacienteResponse[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<PacienteResponse> {
    return this.http.get<PacienteResponse>(`${this.baseUrl}/${id}`);
  }

  criar(paciente: PacienteRequest): Observable<PacienteResponse> {
    return this.http.post<PacienteResponse>(this.baseUrl, paciente);
  }

  atualizar(id: number, paciente: PacienteRequest): Observable<PacienteResponse> {
    return this.http.put<PacienteResponse>(`${this.baseUrl}/${id}`, paciente);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  gerarResumoIa(id: number): Observable<ResumoIaResponse> {
    return this.http.post<ResumoIaResponse>(`${this.baseUrl}/${id}/resumo-ia`, {});
  }
}