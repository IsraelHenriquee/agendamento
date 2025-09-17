export interface CreateUserRequest {
  nome: string
  email: string
  senha: string
  role: 'admin' | 'user'
}

export interface CreateUserResponse {
  success: boolean
  user: {
    id: string
    email: string
    profile: {
      id: number
      user_id: string
      nome: string
      email: string
      role: string
      created_at: string
    }
  }
}
