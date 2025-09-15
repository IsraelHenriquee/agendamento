<template>
  <div 
    class="bg-blue-100 border border-blue-200 rounded-md p-2 text-xs cursor-pointer hover:bg-blue-200 transition-colors absolute left-1 right-1 overflow-hidden"
    :style="{ 
      height: alturaSlot + 'px', 
      minHeight: '40px',
      top: posicaoTop + 'px'
    }"
  >
    <!-- Horário -->
    <div class="text-blue-600 font-medium mb-1 text-xs leading-tight">
      {{ horarioInicio }} - {{ horarioFim }}
    </div>
    
    <!-- Título -->
    <div class="text-blue-800 font-semibold text-sm leading-tight truncate">
      {{ titulo }}
    </div>
    
    <!-- Descrição (apenas se houver espaço) -->
    <div 
      v-if="mostrarDescricao"
      class="text-blue-700 text-xs leading-tight mt-1 truncate"
    >
      {{ descricao }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AgAgendamento } from '../../../shared/types/database'

interface Props {
  agendamento: AgAgendamento
}

const props = defineProps<Props>()

// Computed para criar objetos Date baseados nos campos de data e hora
const dataInicio = computed(() => {
  if (!props.agendamento.data || !props.agendamento.hora_inicio) return new Date()
  
  const data = new Date(props.agendamento.data)
  const partesHora = props.agendamento.hora_inicio.split(':')
  const horas = parseInt(partesHora[0] || '0', 10)
  const minutos = parseInt(partesHora[1] || '0', 10)
  
  data.setHours(horas, minutos, 0, 0)
  return data
})

const dataFim = computed(() => {
  if (!props.agendamento.data || !props.agendamento.hora_fim) return new Date()
  
  const data = new Date(props.agendamento.data)
  const partesHora = props.agendamento.hora_fim.split(':')
  const horas = parseInt(partesHora[0] || '0', 10)
  const minutos = parseInt(partesHora[1] || '0', 10)
  
  data.setHours(horas, minutos, 0, 0)
  return data
})

// Computed para formatar horários
const horarioInicio = computed(() => {
  return dataInicio.value.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
})

const horarioFim = computed(() => {
  return dataFim.value.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
})

// Computed para título e descrição com fallback
const titulo = computed(() => {
  return props.agendamento.titulo || 'Agendamento'
})

const descricao = computed(() => {
  return props.agendamento.descricao || ''
})

// Computed para calcular altura baseada na duração (100px por hora)
const alturaSlot = computed(() => {
  const diferencaMinutos = (dataFim.value.getTime() - dataInicio.value.getTime()) / (1000 * 60)
  // Usando 100px por hora
  return Math.max((diferencaMinutos / 60) * 100, 40) // Mínimo 40px
})

// Computed para calcular a posição top em pixels baseado no horário de início
const posicaoTop = computed(() => {
  const horaInicio = dataInicio.value.getHours()
  const minutoInicio = dataInicio.value.getMinutes()
  
  // Base: 8:00 AM com padding inicial da régua
  const paddingTopRegua = 8 // Padding inicial da régua
  const offsetHoras = horaInicio - 8
  const offsetMinutos = minutoInicio * (100 / 60) // 100px por hora = ~1.67px por minuto
  
  return paddingTopRegua + (offsetHoras * 100) + offsetMinutos
})

// Computed para determinar se deve mostrar a descrição baseado na altura disponível
const mostrarDescricao = computed(() => {
  // Altura mínima para mostrar descrição com 100px por hora: 
  // - 16px (horário) + 20px (título) + 16px (descrição) + 8px (padding/margins) = 60px
  return alturaSlot.value >= 70 && descricao.value.length > 0
})
</script>
