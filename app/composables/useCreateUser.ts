interface CreateUserData {
  nome: string
  email: string
  senha: string
  role: 'admin' | 'user'
}

interface CreateUserResponse {
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

export const useCreateUser = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createUser = async (userData: CreateUserData): Promise<CreateUserResponse | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<CreateUserResponse>('/api/create-user', {
        method: 'POST',
        body: userData
      })

      return response
    } catch (err: any) {
      console.error('Erro ao criar usuário:', err)
      error.value = err?.data?.message || err?.message || 'Erro ao criar usuário'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    createUser,
    loading: readonly(loading),
    error: readonly(error)
  }
}
