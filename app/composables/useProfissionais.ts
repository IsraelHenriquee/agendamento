import type { AgEspecialidade, AgProfissional, AgPerfil, AgCliente } from '../../shared/types/database'

export const useProfissionais = () => {
  const supabase = useSupabaseClient<any>()

  // Buscar profissionais
  const fetchProfissionais = async () => {
    const { data, error } = await supabase
      .rpc('ag_get_profissionais')

    if (error) {
      throw error
    }

    return data as AgProfissional[]
  }

  // Buscar perfis (apenas para admin)
  const fetchPerfis = async () => {
    const { data, error } = await supabase
      .rpc('ag_get_all_profiles_if_admin')

    if (error) {
      throw error
    }

    return data as AgPerfil[]
  }

  // Inserir profissional
  const addProfissional = async (profileId: number, especialidadeId: number) => {
    const { data, error } = await supabase
      .from('ag_profissionais')
      .insert({
        profile_id: profileId,
        especialidade_id: especialidadeId
      })
      .select()

    if (error) {
      throw error
    }

    return { success: true, message: 'Profissional criado com sucesso', data }
  }

  // Atualizar profissional
  const updateProfissional = async (profissionalId: number, profileId: number, especialidadeId: number) => {
    const { data, error } = await supabase
      .from('ag_profissionais')
      .update({
        profile_id: profileId,
        especialidade_id: especialidadeId
      })
      .eq('id', profissionalId)
      .select()

    if (error) {
      throw error
    }

    return { success: true, message: 'Profissional atualizado com sucesso', data }
  }

  // Deletar profissional
  const deleteProfissional = async (profissionalId: number) => {
    const { error } = await supabase
      .from('ag_profissionais')
      .delete()
      .eq('id', profissionalId)

    if (error) {
      throw error
    }

    return { success: true, message: 'Profissional deletado com sucesso' }
  }

  // Buscar especialidades
  const fetchEspecialidades = async () => {
    const { data, error } = await supabase
      .from('ag_especialidades')
      .select('id, especialidade')
      .order('especialidade')

    if (error) {
      throw error
    }

    return data as AgEspecialidade[]
  }

  // Buscar uma especialidade específica por ID
  const fetchEspecialidadeById = async (id: number) => {
    const { data, error } = await supabase
      .from('ag_especialidades')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return data
  }

  // Inserir especialidade
  const addEspecialidade = async (especialidade: string) => {
    const { data, error } = await supabase
      .rpc('ag_add_especialidade', {
        p_especialidade: especialidade
      })

    if (error) {
      throw error
    }

    return data
  }

  // Atualizar especialidade
  const updateEspecialidade = async (id: number, especialidade: string) => {
    const { data, error } = await supabase
      .rpc('ag_update_especialidade', {
        p_id: id,
        p_nova_especialidade: especialidade
      })

    if (error) {
      throw error
    }

    return data
  }

  // Deletar especialidade
  const deleteEspecialidade = async (id: number) => {
    const { error } = await supabase
      .from('ag_especialidades')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return { success: true, message: 'Especialidade deletada com sucesso' }
  }

  // Buscar clientes
  const fetchClientes = async () => {
    const { data, error } = await supabase
      .from('ag_clientes')
      .select('*')
      .order('nome')

    if (error) {
      throw error
    }

    return data as AgCliente[]
  }

  // Inserir cliente
  const addCliente = async (nome: string, cpf: string, endereco?: string, email?: string, telefone?: string) => {
    const { data, error } = await supabase
      .from('ag_clientes')
      .insert({
        nome,
        cpf,
        endereco: endereco || null,
        email: email || null,
        telefone: telefone || null
      })
      .select()

    if (error) {
      throw error
    }

    return { success: true, message: 'Cliente criado com sucesso', data }
  }

  // Atualizar cliente
  const updateCliente = async (clienteId: number, nome: string, cpf: string, endereco?: string, email?: string, telefone?: string) => {
    const { data, error } = await supabase
      .from('ag_clientes')
      .update({
        nome,
        cpf,
        endereco: endereco || null,
        email: email || null,
        telefone: telefone || null
      })
      .eq('id', clienteId)
      .select()

    if (error) {
      throw error
    }

    return { success: true, message: 'Cliente atualizado com sucesso', data }
  }

  // Deletar cliente
  const deleteCliente = async (clienteId: number) => {
    const { error } = await supabase
      .from('ag_clientes')
      .delete()
      .eq('id', clienteId)

    if (error) {
      throw error
    }

    return { success: true, message: 'Cliente deletado com sucesso' }
  }

  return {
    fetchProfissionais,
    fetchPerfis,
    addProfissional,
    updateProfissional,
    deleteProfissional,
    fetchEspecialidades,
    fetchEspecialidadeById,
    addEspecialidade,
    updateEspecialidade,
    deleteEspecialidade,
    fetchClientes,
    addCliente,
    updateCliente,
    deleteCliente
  }
}
