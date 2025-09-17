export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Estado de loading
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Login com email e senha
  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        throw authError
      }

      // Redirecionar para a página inicial após login bem-sucedido
      await navigateTo('/')
      
      return { data, error: null }
    } catch (err: any) {
      error.value = err.message || 'Erro ao fazer login'
      return { data: null, error: err }
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      isLoading.value = true
      error.value = null

      const { error: authError } = await supabase.auth.signOut()

      if (authError) {
        throw authError
      }

      // Redirecionar para a página de login após logout
      await navigateTo('/login')
      
      return { error: null }
    } catch (err: any) {
      error.value = err.message || 'Erro ao fazer logout'
      return { error: err }
    } finally {
      isLoading.value = false
    }
  }

  // Alterar senha
  const changePassword = async (newPassword: string) => {
    try {
      isLoading.value = true
      error.value = null

      const { data, error: authError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (authError) {
        throw authError
      }

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message || 'Erro ao alterar senha'
      return { data: null, error: err }
    } finally {
      isLoading.value = false
    }
  }

  // Recuperar senha
  const recoverPassword = async (email: string) => {
    try {
      isLoading.value = true
      error.value = null

      const { data, error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/recuperar-senha`
      })

      if (authError) {
        throw authError
      }

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message || 'Erro ao enviar link de recuperação'
      return { data: null, error: err }
    } finally {
      isLoading.value = false
    }
  }

  // Alterar nome do usuário
  const updateUserName = async (novoNome: string) => {
    try {
      isLoading.value = true
      error.value = null

      const { data, error: rpcError } = await (supabase as any)
        .rpc('ag_update_infos_user', {
          novo_nome: novoNome
        })

      if (rpcError) {
        throw rpcError
      }

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message || 'Erro ao alterar nome'
      return { data: null, error: err }
    } finally {
      isLoading.value = false
    }
  }

  // Criar novo usuário (apenas para admins)
  const createUser = async (userData: {
    nome: string
    email: string
    senha: string
    role: 'admin' | 'user'
  }) => {
    try {
      isLoading.value = true
      error.value = null

      // Fazer requisição para a API do servidor
      const data = await $fetch<{
        success: boolean
        user: {
          id: string
          email: string
          profile: any
        }
      }>('/api/create-user', {
        method: 'POST',
        body: userData
      })

      return { data, error: null }
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || 'Erro ao criar usuário'
      error.value = errorMessage
      return { data: null, error: err }
    } finally {
      isLoading.value = false
    }
  }

  // Deletar usuário (apenas para admins)
  const deleteUser = async (userId: string) => {
    try {
      isLoading.value = true
      error.value = null

      // Fazer requisição para a API do servidor
      const data = await $fetch<{
        success: boolean
        message: string
        deletedProfile: any
      }>('/api/delete-user', {
        method: 'POST',
        body: { user_id: userId }
      })

      return { data, error: null }
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || 'Erro ao deletar usuário'
      error.value = errorMessage
      return { data: null, error: err }
    } finally {
      isLoading.value = false
    }
  }

  // Verificar se o usuário é admin
  const isAdmin = async () => {
    try {
      const { data, error: rpcError } = await supabase.rpc('ag_isadmin')

      if (rpcError) {
        throw rpcError
      }

      return { isAdmin: (data as any)?.isadmin || false, error: null }
    } catch (err: any) {
      console.error('Erro ao verificar se usuário é admin:', err)
      return { isAdmin: false, error: err }
    }
  }

  // Verificar se o usuário está autenticado
  const isAuthenticated = computed(() => !!user.value)

  return {
    // Estado
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isAuthenticated,

    // Métodos
    login,
    logout,
    changePassword,
    recoverPassword,
    updateUserName,
    createUser,
    deleteUser,
    isAdmin
  }
}
