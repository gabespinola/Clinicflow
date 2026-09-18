export interface ConsultaRequest {
  dataHora: string;
  status: string;
  observacoes?: string;
  medicoId: number;
  pacienteId: number;
}

export interface ConsultaResponse {
  id: number;
  dataHora: string;
  status: string;
  observacoes?: string;
  medicoId: number;
  medicoNome: string;
  pacienteId: number;
  pacienteNome: string;
}