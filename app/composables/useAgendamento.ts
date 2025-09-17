import type { AgAgendamento, AgViewAgendamentosCompleto } from '../../shared/types/database'
import { ref, watch } from 'vue'

/**
 * Composable para agendamentos
 */
export function useAgendamento() {
  const agendamentos = ref<AgAgendamento[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Cliente Supabase
  const supabase = useSupabaseClient()
  
  // Store de agendamento para pegar as datas da semana
  const agendamentoStore = useAgendamentoStore()

  // Cache: Map<string, AgAgendamento[]> onde a key é "profissionalId-dataInicio-dataFim"
  const cache = new Map<string, AgAgendamento[]>()

  /**
   * Gera chave do cache baseada no profissional e período da semana
   */
  function gerarChaveCache(profissionalId: number, dataInicio: string, dataFim: string): string {
    return `${profissionalId}-${dataInicio}-${dataFim}`
  }

  /**
   * Busca agendamentos por profissional na semana específica (não traz cancelados)
   */
  async function fetchAgendamentosByProfissional(profissionalId: number) {
    const diasSemana = agendamentoStore.diasSemana
    if (!diasSemana || diasSemana.length < 7) {
      console.warn('Dias da semana não estão disponíveis ainda')
      return
    }

    // Primeira e última data da semana
    const primeiroDia = diasSemana[0]
    const ultimoDia = diasSemana[6]
    
    if (!primeiroDia || !ultimoDia) {
      console.warn('Datas da semana inválidas')
      return
    }

    const dataInicio = primeiroDia.toISOString().split('T')[0] // YYYY-MM-DD
    const dataFim = ultimoDia.toISOString().split('T')[0]      // YYYY-MM-DD

    if (!dataInicio || !dataFim) {
      console.warn('Não foi possível formatar as datas')
      return
    }

    // Verificar cache primeiro
    const chaveCache = gerarChaveCache(profissionalId, dataInicio, dataFim)
    if (cache.has(chaveCache)) {
      console.log('Dados encontrados no cache para:', chaveCache)
      agendamentos.value = cache.get(chaveCache) || []
      return
    }

    loading.value = true
    error.value = null
    
    try {
      console.log('Buscando agendamentos no banco:', { profissionalId, dataInicio, dataFim })
      
      const { data, error: fetchError } = await supabase
        .from('ag_agendamentos')
        .select('*')
        .eq('profissional_id', profissionalId)
        .eq('cancelado', false)
        .gte('data', dataInicio)  // maior ou igual à data de início
        .lte('data', dataFim)     // menor ou igual à data de fim
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true })

      if (fetchError) throw fetchError
      
      const resultado = data || []
      
      // Salvar no cache
      cache.set(chaveCache, resultado)
      console.log('Dados salvos no cache:', chaveCache, resultado.length, 'agendamentos')
      
      agendamentos.value = resultado
      
    } catch (err: any) {
      console.error('Erro ao buscar agendamentos:', err)
      error.value = err.message || 'Erro ao buscar agendamentos'
    } finally {
      loading.value = false
    }
  }

  /**
   * Limpa o cache (útil quando dados são alterados)
   */
  function limparCache() {
    cache.clear()
    console.log('Cache de agendamentos limpo')
  }

  /**
   * Atualiza um agendamento existente
   */
  async function atualizarAgendamento(id: number, dadosAtualizacao: {
    titulo?: string
    descricao?: string | null
    cor?: string | null
  }) {
    loading.value = true
    error.value = null
    
    try {
      console.log('Atualizando agendamento:', id, dadosAtualizacao)
      
      const { data, error: updateError } = await (supabase as any)
        .from('ag_agendamentos')
        .update(dadosAtualizacao)
        .eq('id', id)
        .select()

      if (updateError) throw updateError
      
      console.log('Agendamento atualizado com sucesso:', data)
      
      // Limpar cache para forçar atualização na próxima busca
      limparCache()
      
      return data?.[0] || null
      
    } catch (err: any) {
      console.error('Erro ao atualizar agendamento:', err)
      error.value = err.message || 'Erro ao atualizar agendamento'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Cancela um agendamento (marca como cancelado)
   */
  async function cancelarAgendamento(id: number) {
    loading.value = true
    error.value = null
    
    try {
      console.log('Cancelando agendamento:', id)
      
      const { data, error: updateError } = await (supabase as any)
        .from('ag_agendamentos')
        .update({
          cancelado: true,
          cancelado_as: new Date().toISOString()
        })
        .eq('id', id)
        .select()

      if (updateError) throw updateError
      
      console.log('Agendamento cancelado com sucesso:', data)
      
      // Limpar cache para forçar atualização na próxima busca
      limparCache()
      
      return data?.[0] || null
      
    } catch (err: any) {
      console.error('Erro ao cancelar agendamento:', err)
      error.value = err.message || 'Erro ao cancelar agendamento'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Insere um novo agendamento no banco de dados
   */
  async function inserirAgendamento(dadosAgendamento: {
    profissional_id: number
    cliente_id: number
    data: string
    hora_inicio: string // Formato: HH:MM:SS-03:00 (time with timezone)
    hora_fim: string // Formato: HH:MM:SS-03:00 (time with timezone)
    titulo: string
    descricao?: string | null
    cor?: string | null
  }) {
    loading.value = true
    error.value = null
    
    try {
      console.log('Inserindo novo agendamento:', dadosAgendamento)
      
      const { data, error: insertError } = await (supabase as any)
        .from('ag_agendamentos')
        .insert({
          profissional_id: dadosAgendamento.profissional_id,
          cliente_id: dadosAgendamento.cliente_id,
          data: dadosAgendamento.data,
          hora_inicio: dadosAgendamento.hora_inicio,
          hora_fim: dadosAgendamento.hora_fim,
          titulo: dadosAgendamento.titulo,
          descricao: dadosAgendamento.descricao || null,
          cor: dadosAgendamento.cor || '#DBE9FE',
          cancelado: false
        })
        .select()

      if (insertError) throw insertError
      
      console.log('Agendamento inserido com sucesso:', data)
      
      // Limpar cache para forçar atualização na próxima busca
      limparCache()
      
      return data?.[0] || null
      
    } catch (err: any) {
      console.error('Erro ao inserir agendamento:', err)
      error.value = err.message || 'Erro ao inserir agendamento'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca relatório completo de agendamentos com filtros opcionais
   */
  async function fetchRelatorioAgendamentos(filtros?: {
    profissionalId?: number
    clienteId?: number
    dataInicio?: string // YYYY-MM-DD
    dataFim?: string    // YYYY-MM-DD
    incluirCancelados?: boolean
  }) {
    loading.value = true
    error.value = null
    
    try {
      console.log('Buscando relatório de agendamentos via RPC:', filtros)
      
      // Usar a função RPC do backend ao invés da view protegida
      const { data, error: fetchError } = await supabase
        .rpc('ag_get_agendamentos_completo')

      if (fetchError) throw fetchError
      
      let resultado = data as AgViewAgendamentosCompleto[] || []
      
      // Aplicar filtros do lado do cliente se fornecidos
      if (filtros?.profissionalId) {
        resultado = resultado.filter(item => item.profissional_id === filtros.profissionalId)
      }

      if (filtros?.clienteId) {
        resultado = resultado.filter(item => item.cliente_id === filtros.clienteId)
      }

      if (filtros?.dataInicio) {
        resultado = resultado.filter(item => item.data && item.data >= filtros.dataInicio!)
      }

      if (filtros?.dataFim) {
        resultado = resultado.filter(item => item.data && item.data <= filtros.dataFim!)
      }

      // Remover filtro de cancelados - mostrar todos os agendamentos
      // if (!filtros?.incluirCancelados) {
      //   resultado = resultado.filter(item => !item.cancelado)
      // }

      // Ordenar por data e horário (mais recente primeiro)
      resultado.sort((a, b) => {
        const dataA = a.data || ''
        const dataB = b.data || ''
        if (dataA !== dataB) {
          return dataB.localeCompare(dataA) // Invertido para mais recente primeiro
        }
        const horaA = a.hora_inicio || ''
        const horaB = b.hora_inicio || ''
        return horaB.localeCompare(horaA) // Invertido para mais recente primeiro
      })
      
      console.log('Relatório de agendamentos carregado via RPC:', resultado.length, 'registros')
      
      return resultado
      
    } catch (err: any) {
      console.error('Erro ao buscar relatório de agendamentos:', err)
      error.value = err.message || 'Erro ao buscar relatório de agendamentos'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    agendamentos,
    loading,
    error,
    fetchAgendamentosByProfissional,
    limparCache,
    inserirAgendamento,
    atualizarAgendamento,
    cancelarAgendamento,
    fetchRelatorioAgendamentos
  }
}
