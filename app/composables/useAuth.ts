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
    logout
  }
}
