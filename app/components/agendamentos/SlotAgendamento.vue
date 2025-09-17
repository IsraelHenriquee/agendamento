<template>
  <div 
    class="border border-blue-200 rounded-md p-2 text-xs cursor-pointer hover:brightness-95 transition-all absolute left-1 right-1 overflow-hidden"
    :style="{ 
      backgroundColor: corFundo,
      color: corTexto,
      height: alturaSlot + 'px', 
      minHeight: '40px',
      top: posicaoTop + 'px'
    }"
    @click="$emit('editar', agendamento)"
  >
    <!-- Horário -->
    <div class="font-medium mb-1 text-xs leading-tight opacity-90">
      {{ horarioInicio }} - {{ horarioFim }}
    </div>
    
    <!-- Título -->
    <div class="font-semibold text-sm leading-tight truncate">
      {{ titulo }}
    </div>
    
    <!-- Descrição (apenas se houver espaço) -->
    <div 
      v-if="mostrarDescricao"
      class="text-xs leading-tight mt-1 truncate opacity-90"
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

const emit = defineEmits<{
  'editar': [agendamento: AgAgendamento]
}>()

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

// Função para converter hex para rgb
const hexParaRgb = (hex: string) => {
  // Remove # se presente
  hex = hex.replace('#', '')
  
  // Converter para RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  return { r, g, b }
}

// Função para calcular luminância e determinar se é cor clara ou escura
const corEClara = (hex: string) => {
  const { r, g, b } = hexParaRgb(hex)
  
  // Fórmula de luminância
  const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminancia > 0.5
}

// Computed para cores dinâmicas baseadas na cor do banco
const corPrincipal = computed(() => {
  return props.agendamento.cor || '#DBE9FE' // Fallback para cor padrão
})

const corFundo = computed(() => {
  return corPrincipal.value
})

const corTexto = computed(() => {
  // Determinar cor do texto baseada na luminância da cor de fundo
  const corClara = corEClara(corPrincipal.value)
  
  if (corClara) {
    // Se a cor de fundo for clara, usar texto escuro
    const { r, g, b } = hexParaRgb(corPrincipal.value)
    const fator = 0.3 // Fator para escurecer
    const rEscuro = Math.round(r * fator)
    const gEscuro = Math.round(g * fator)
    const bEscuro = Math.round(b * fator)
    
    return `rgb(${rEscuro}, ${gEscuro}, ${bEscuro})`
  } else {
    // Se a cor de fundo for escura, usar texto claro
    return '#ffffff'
  }
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
  
  // Base: 8:00 AM alinhado com a régua
  // Considerando apenas py-2 (8px) + pt-2 (8px) = 16px de offset inicial
  const offsetHoras = horaInicio - 8
  const offsetMinutos = minutoInicio * (100 / 60) // 100px por hora = ~1.67px por minuto
  
  // Apenas 10px de padding inicial para alinhar com o texto da régua
  return 10 + (offsetHoras * 100) + offsetMinutos
})

// Computed para determinar se deve mostrar a descrição baseado na altura disponível
const mostrarDescricao = computed(() => {
  // Altura mínima para mostrar descrição com 100px por hora: 
  // - 16px (horário) + 20px (título) + 16px (descrição) + 8px (padding/margins) = 60px
  return alturaSlot.value >= 70 && descricao.value.length > 0
})
</script>
