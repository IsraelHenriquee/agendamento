export default defineEventHandler(async (event) => {
  try {
    // Ler o body da requisição
    const body = await readBody(event)
    
    // Validar dados obrigatórios
    if (!body.email || !body.senha || !body.nome || !body.role) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email, senha, nome e role são obrigatórios'
      })
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email deve ter um formato válido'
      })
    }

    // Validar role
    if (!['admin', 'user'].includes(body.role)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Role deve ser admin ou user'
      })
    }

    // Validar senha
    if (body.senha.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Senha deve ter pelo menos 6 caracteres'
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

    // Criar usuário no Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: body.senha,
      email_confirm: true // Auto-confirma o email
    })

    if (authError) {
      console.error('Erro ao criar usuário no Auth:', authError)
      throw createError({
        statusCode: 400,
        statusMessage: authError.message || 'Erro ao criar usuário'
      })
    }

    if (!authUser?.user?.id) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Usuário criado mas ID não retornado'
      })
    }

    // Inserir dados do perfil na tabela ag_profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('ag_profiles')
      .insert({
        user_id: authUser.user.id,
        nome: body.nome.trim(),
        email: body.email.trim(),
        role: body.role
      })
      .select()
      .single()

    if (profileError) {
      console.error('Erro ao criar perfil:', profileError)
      
      // Se falhou ao criar o perfil, remover o usuário do Auth
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao criar perfil do usuário'
      })
    }

    // Retornar sucesso
    return {
      success: true,
      user: {
        id: authUser.user.id,
        email: authUser.user.email,
        profile: profile
      }
    }

  } catch (error: any) {
    console.error('Erro na criação de usuário:', error)
    
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
