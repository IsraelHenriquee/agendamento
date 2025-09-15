// Tipos da base de dados Supabase
export interface AgProfile {
  id: number
  created_at: string
  user_id: string | null
  nome: string | null
  role: string | null
}

// Especialidades
export interface AgEspecialidade {
  id: number
  especialidade: string | null
}

// Profissionais
export interface AgProfissional {
  profissional_id: number
  profile_id: number
  nome: string
  especialidade_id: number
  especialidade: string
}

// Perfis
export interface AgPerfil {
  id: number
  nome: string
}

// Clientes
export interface AgCliente {
  id: number
  created_at: string
  cpf: string | null
  nome: string | null
  endereco: string | null
  email: string | null
  telefone: string | null
}

// Agendamentos
export interface AgAgendamento {
  id: number
  created_at: string
  user_id: string | null
  profissional_id: number | null
  cliente_id: number | null
  data: string | null // ISO date
  hora_inicio: string | null // ISO time
  hora_fim: string | null // ISO time
  titulo: string | null
  descricao: string | null
  cancelado: boolean | null
  cancelado_as: string | null
}

// Estado do store de usuário
export interface UserState {
  profile: AgProfile | null
  loading: boolean
  error: string | null
}
