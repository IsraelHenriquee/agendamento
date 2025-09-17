import type { AgAgendamento, AgProfissional } from '../../shared/types/database'

export function useValidacaoHorarios(
  agendamentos: Ref<AgAgendamento[]>,
  profissional: Ref<AgProfissional | null>
) {
  // Função para converter hora string para minutos
  const horaParaMinutos = (hora: string): number => {
    const [h, m] = hora.split(':').map(Number)
    return (h || 0) * 60 + (m || 0)
  }

  // Função para verificar se um horário está ocupado
  const horarioEstaOcupado = (data: string, horaInicio: string, horaFim?: string): boolean => {
    if (!profissional.value?.profissional_id) return false
    
    const agendamentosNaData = agendamentos.value.filter(ag => {
      return ag.profissional_id === profissional.value?.profissional_id && 
             ag.data === data
    })
    
    const inicioMinutos = horaParaMinutos(horaInicio)
    const fimMinutos = horaFim ? horaParaMinutos(horaFim) : inicioMinutos + 30
    
    return agendamentosNaData.some(ag => {
      if (!ag.hora_inicio || !ag.hora_fim) return false
      
      const agInicioMinutos = horaParaMinutos(ag.hora_inicio)
      const agFimMinutos = horaParaMinutos(ag.hora_fim)
      
      return (inicioMinutos < agFimMinutos && fimMinutos > agInicioMinutos)
    })
  }

  // Gerar horários disponíveis (8h às 22h)
  const gerarHorariosDisponiveis = () => {
    const horarios = []
    for (let hora = 8; hora <= 22; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const horaStr = hora.toString().padStart(2, '0')
        const minutoStr = minuto.toString().padStart(2, '0')
        const value = `${horaStr}:${minutoStr}`
        const label = `${horaStr}:${minutoStr}`
        horarios.push({ value, label })
      }
    }
    return horarios
  }

  // Horários de início disponíveis (removendo ocupados)
  const obterHorariosInicioDisponiveis = (data: string) => {
    const todosHorarios = gerarHorariosDisponiveis()
    
    if (!data) return todosHorarios
    
    return todosHorarios.filter(horario => {
      return !horarioEstaOcupado(data, horario.value)
    })
  }

  // Horários de fim disponíveis
  const obterHorariosFimDisponiveis = (data: string, horaInicio: string) => {
    if (!horaInicio || !data) return []
    
    const todosHorarios = gerarHorariosDisponiveis()
    const inicioMinutos = horaParaMinutos(horaInicio)
    
    // Buscar próximo agendamento para limitar horário de fim
    const agendamentosNaData = agendamentos.value.filter(ag => {
      return ag.profissional_id === profissional.value?.profissional_id && 
             ag.data === data &&
             ag.hora_inicio &&
             ag.hora_fim
    }).sort((a, b) => horaParaMinutos(a.hora_inicio!) - horaParaMinutos(b.hora_inicio!))
    
    const proximoAgendamento = agendamentosNaData.find(ag => {
      const agInicioMinutos = horaParaMinutos(ag.hora_inicio!)
      return agInicioMinutos > inicioMinutos
    })
    
    const limiteMaximo = proximoAgendamento ? horaParaMinutos(proximoAgendamento.hora_inicio!) : 22 * 60 + 30
    
    return todosHorarios.filter(horario => {
      const totalMinutos = horaParaMinutos(horario.value)
      return totalMinutos > inicioMinutos && totalMinutos <= limiteMaximo
    })
  }

  // Validar se há conflito de horários
  const validarConflito = (data: string, horaInicio: string, horaFim: string): string | null => {
    if (horarioEstaOcupado(data, horaInicio, horaFim)) {
      return 'Este horário está ocupado. Escolha outro horário.'
    }
    
    const inicioMinutos = horaParaMinutos(horaInicio)
    const fimMinutos = horaParaMinutos(horaFim)
    
    if (fimMinutos <= inicioMinutos) {
      return 'A hora de fim deve ser posterior à hora de início'
    }
    
    return null
  }

  return {
    horarioEstaOcupado,
    obterHorariosInicioDisponiveis,
    obterHorariosFimDisponiveis,
    validarConflito
  }
}
