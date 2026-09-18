export interface MedicoRequest {
  nome: string;
  crm: string;
  especialidade: string;
  telefone?: string;
  email?: string;
}

export interface MedicoResponse {
  id: number;
  nome: string;
  crm: string;
  especialidade: string;
  telefone?: string;
  email?: string;
}