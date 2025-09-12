import { defineStore } from 'pinia'

export const useAgendamentoStore = defineStore('agendamento', () => {
  // Estado reativo
  const dataReferencia = ref(new Date())

  // Computed para calcular os dias da semana baseado na data de referência
  const diasSemana = computed(() => {
    const dias = []
    const data = new Date(dataReferencia.value)
    
    // Encontra o domingo da semana da data de referência
    const diferencaDomingo = data.getDay()
    const domingo = new Date(data)
    domingo.setDate(data.getDate() - diferencaDomingo)
    
    // Gera array com os 7 dias da semana (domingo a sábado)
    for (let i = 0; i < 7; i++) {
      const dia = new Date(domingo)
      dia.setDate(domingo.getDate() + i)
      dias.push(new Date(dia))
    }
    
    return dias
  })

  // Função para avançar uma semana
  const avancarSemana = () => {
    const novaData = new Date(dataReferencia.value)
    novaData.setDate(novaData.getDate() + 7)
    dataReferencia.value = novaData
  }

  // Função para voltar uma semana
  const voltarSemana = () => {
    const novaData = new Date(dataReferencia.value)
    novaData.setDate(novaData.getDate() - 7)
    dataReferencia.value = novaData
  }

  // Função para definir uma data específica como referência
  const setDataReferencia = (data: Date) => {
    dataReferencia.value = new Date(data)
  }

  return {
    // Estado
    dataReferencia,
    diasSemana,
    
    // Actions
    avancarSemana,
    voltarSemana,
    setDataReferencia
  }
})
