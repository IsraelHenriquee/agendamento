import { defineStore } from 'pinia'
import type { AgProfile, UserState } from '../../shared/types/database'

export const useUserStore = defineStore('user', () => {
  // Estado reativo
  const state = reactive<UserState>({
    profile: null,
    loading: false,
    error: null
  })

  // Cliente Supabase
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Action para buscar perfil
  const fetchProfile = async () => {
    if (!user.value?.id) {
      state.profile = null
      return
    }

    state.loading = true
    state.error = null

    try {
      const { data, error } = await supabase
        .from('ag_profiles')
        .select('*')
        .eq('user_id', user.value.id)
        .single()

      if (error) {
        throw error
      }

      state.profile = data as AgProfile
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error)
      state.error = error.message || 'Erro ao carregar perfil'
      state.profile = null
    } finally {
      state.loading = false
    }
  }

  // Limpar perfil
  const clearProfile = () => {
    state.profile = null
    state.error = null
    state.loading = false
  }

  // Watcher para mudanças no usuário autenticado
  watch(user, async (newUser) => {
    if (newUser) {
      await fetchProfile()
    } else {
      clearProfile()
    }
  }, { immediate: true })

  return {
    // Estado
    profile: toRef(state, 'profile'),
    loading: toRef(state, 'loading'),
    error: toRef(state, 'error'),
    
    // Actions
    fetchProfile,
    clearProfile
  }
})
