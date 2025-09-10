export default defineNuxtPlugin(() => {
  const userStore = useUserStore()
  
  // Inicializar store do usuário apenas no client-side
  // O watcher já está configurado no store para buscar automaticamente
  // quando há mudança no useSupabaseUser()
  
  // Garantir que o perfil seja carregado se o usuário já estiver autenticado
  const user = useSupabaseUser()
  if (user.value && !userStore.profile) {
    userStore.fetchProfile()
  }
})
