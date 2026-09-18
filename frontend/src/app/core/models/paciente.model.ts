export interface PacienteRequest {
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone?: string;
  email?: string;
  endereco?: string;
}

export interface PacienteResponse {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  resumoIa?: string;
  resumoIaGeradoEm?: string;
}