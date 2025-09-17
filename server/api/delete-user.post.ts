export default defineEventHandler(async (event) => {
  try {
    // Ler o body da requisição
    const body = await readBody(event)
    
    // Validar dados obrigatórios
    if (!body.user_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'user_id é obrigatório'
      })
    }

    // Obter configuração do runtime
    const config = useRuntimeConfig()
    
    // Verificar se temos a service key configurada
    if (!process.env.SUPABASE_SERVICE_KEY) {
      throw createError({
        statusCode: 500,
        statusMessage: 'SUPABASE_SERVICE_KEY não configurada no ambiente'
      })
    }

    // Criar cliente admin manualmente com service key
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL || config.public.supabase.url, 
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Primeiro, buscar o perfil do usuário para ter os dados antes de deletar
    const { data: profile, error: profileFetchError } = await supabaseAdmin
      .from('ag_profiles')
      .select('*')
      .eq('user_id', body.user_id)
      .single()

    if (profileFetchError && profileFetchError.code !== 'PGRST116') {
      console.error('Erro ao buscar perfil:', profileFetchError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao buscar dados do usuário'
      })
    }

    // Deletar o perfil da tabela ag_profiles (se existir)
    if (profile) {
      const { error: profileDeleteError } = await supabaseAdmin
        .from('ag_profiles')
        .delete()
        .eq('user_id', body.user_id)

      if (profileDeleteError) {
        console.error('Erro ao deletar perfil:', profileDeleteError)
        throw createError({
          statusCode: 500,
          statusMessage: 'Erro ao deletar perfil do usuário'
        })
      }
    }

    // Deletar o usuário do Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(body.user_id)

    if (authError) {
      console.error('Erro ao deletar usuário no Auth:', authError)
      
      // Se falhou ao deletar do Auth, tentar restaurar o perfil
      if (profile) {
        await supabaseAdmin
          .from('ag_profiles')
          .insert({
            user_id: profile.user_id,
            nome: profile.nome,
            email: profile.email,
            role: profile.role
          })
      }
      
      throw createError({
        statusCode: 400,
        statusMessage: authError.message || 'Erro ao deletar usuário'
      })
    }

    // Retornar sucesso
    return {
      success: true,
      message: 'Usuário deletado com sucesso',
      deletedProfile: profile
    }

  } catch (error: any) {
    console.error('Erro na deleção de usuário:', error)
    
    // Se é um erro que já criamos, repassar
    if (error.statusCode) {
      throw error
    }
    
    // Senão, criar erro genérico
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
