import type { AgAgendamento } from '../../shared/types/database'
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

  return {
    agendamentos,
    loading,
    error,
    fetchAgendamentosByProfissional,
    limparCache
  }
}
