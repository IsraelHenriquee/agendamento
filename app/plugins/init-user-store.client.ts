export default defineNuxtPlugin(() => {
  const userStore = useUserStore()
  const route = useRoute()
  
  // Inicializar store do usuário apenas no client-side
  // O watcher já está configurado no store para buscar automaticamente
  // quando há mudança no useSupabaseUser()
  
  // Garantir que o perfil seja carregado se o usuário já estiver autenticado
  // mas não na página de recuperação de senha
  const user = useSupabaseUser()
  if (user.value && !userStore.profile && route.path !== '/recuperar-senha') {
    userStore.fetchProfile()
  }
})
