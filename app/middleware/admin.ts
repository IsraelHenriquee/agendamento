export default defineNuxtRouteMiddleware(async (to, from) => {
  // Verificar se o usuário está autenticado
  const user = useSupabaseUser()
  
  if (!user.value) {
    // Se não estiver logado, redirecionar para login
    return navigateTo('/login')
  }

  // Verificar se o usuário é admin
  const { isAdmin } = useAuth()
  const { isAdmin: userIsAdmin, error } = await isAdmin()

  if (error || !userIsAdmin) {
    // Se não for admin ou houver erro, redirecionar para a página inicial
    return navigateTo('/')
  }
})
