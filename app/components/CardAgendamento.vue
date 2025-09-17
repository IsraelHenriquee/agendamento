<template>
  <div class="flex items-center py-4 px-6 hover:bg-neutral-50 transition-colors duration-150">
    <!-- ID (reduzido) -->
    <div class="w-16 flex-shrink-0 mr-3">
      <div class="text-xs font-mono font-medium text-neutral-700">
        #{{ agendamento.id }}
      </div>
    </div>

    <!-- Indicador de cor e status de cancelado -->
    <div class="flex items-center mr-4">
      <div 
        class="w-1 h-10 rounded-full mr-2"
        :style="{ backgroundColor: agendamento.cor || '#DBE9FE' }"
      ></div>
      
      <!-- Status simplificado -->
      <div class="w-16">
        <span 
          v-if="agendamento.cancelado"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"
        >
          Cancelado
        </span>
        <span 
          v-else
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
        >
          Ativo
        </span>
      </div>
    </div>

    <!-- Data e Horário com ícone (reduzido) -->
    <div class="w-32 flex-shrink-0 mr-4">
      <div class="flex items-center font-medium text-neutral-900 text-xs mb-1">
        <svg class="w-3 h-3 mr-1 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 012 0v4m0 0V9a2 2 0 104 0V7m-4 0a2 2 0 104 0m-4 0H3m0 0v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18" />
        </svg>
        {{ dataFormatada }}
      </div>
      <div class="text-xs text-neutral-600 ml-4">
        {{ horarioFormatado }}
      </div>
    </div>

    <!-- Título (reduzido) -->
    <div class="w-36 flex-shrink-0 mr-4">
      <div class="font-semibold text-neutral-900 text-sm truncate">
        {{ agendamento.titulo || 'Agendamento' }}
      </div>
      <div v-if="agendamento.descricao" class="text-xs text-neutral-500 truncate">
        {{ agendamento.descricao }}
      </div>
    </div>

    <!-- Cliente com CPF (reduzido) -->
    <div class="w-48 flex-shrink-0 mr-4">
      <div class="flex items-center">
        <div class="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center mr-2 flex-shrink-0">
          <svg class="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <div class="font-medium text-neutral-900 text-xs truncate">
            {{ agendamento.cliente_nome || 'Cliente não informado' }}
          </div>
          <div class="text-xs text-neutral-500 truncate">
            {{ formatarCpfOuTelefone() }}
          </div>
        </div>
      </div>
    </div>

    <!-- Profissional (reduzido) -->
    <div class="w-44 flex-shrink-0 mr-4">
      <div class="flex items-center">
        <div 
          class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2 flex-shrink-0"
          :style="{ backgroundColor: gerarCorAvatar(agendamento.profissional_nome || '') }"
        >
          {{ (agendamento.profissional_nome || '').charAt(0).toUpperCase() }}
        </div>
        <div class="min-w-0 flex-1">
          <div class="font-medium text-neutral-900 text-xs truncate">
            {{ agendamento.profissional_nome || 'Profissional não informado' }}
          </div>
          <div class="text-xs text-neutral-500 truncate">
            {{ agendamento.especialidade || 'Especialidade não informada' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Data de Criação (reduzido) -->
    <div class="w-20 flex-shrink-0 mr-3">
      <div class="text-xs text-neutral-400">
        Criado em
      </div>
      <div class="text-xs text-neutral-600">
        {{ formatarDataCriacao(agendamento.created_at) }}
      </div>
    </div>

    <!-- Menu de ações -->
    <div class="flex items-center">
      <button
        type="button"
        class="p-2 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
        @click="$emit('menu', agendamento)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AgViewAgendamentosCompleto } from '../../shared/types/database'

interface Props {
  agendamento: AgViewAgendamentosCompleto
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'menu': [agendamento: AgViewAgendamentosCompleto]
}>()

// Computed para formatar a data
const dataFormatada = computed(() => {
  if (!props.agendamento.data) return 'Data não informada'
  
  const data = new Date(props.agendamento.data)
  return data.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})

// Computed para formatar o horário
const horarioFormatado = computed(() => {
  const inicio = props.agendamento.hora_inicio
  const fim = props.agendamento.hora_fim
  
  if (!inicio || !fim) return 'Horário não informado'
  
  // Extrair apenas a parte HH:MM
  const inicioFormatado = inicio.substring(0, 5)
  const fimFormatado = fim.substring(0, 5)
  
  return `${inicioFormatado} - ${fimFormatado}`
})

// Função para formatar CPF ou exibir telefone como fallback
const formatarCpfOuTelefone = () => {
  const cpf = props.agendamento.cliente_cpf
  const telefone = props.agendamento.cliente_telefone
  
  if (cpf) {
    // Formatar CPF: 123.456.789-01
    const apenasNumeros = cpf.replace(/\D/g, '')
    if (apenasNumeros.length === 11) {
      return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9)}`
    }
    return cpf // Retorna CPF original se não conseguir formatar
  }
  
  return telefone || 'Documento não informado'
}

// Função para gerar cor do avatar baseada no nome
const gerarCorAvatar = (nome: string) => {
  if (!nome) return '#64748B' // slate-500
  
  const cores = [
    '#EF4444', // red-500
    '#F97316', // orange-500
    '#EAB308', // yellow-500
    '#22C55E', // green-500
    '#06B6D4', // cyan-500
    '#3B82F6', // blue-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#64748B', // slate-500
    '#059669', // emerald-600
  ]
  
  const index = nome.charCodeAt(0) % cores.length
  return cores[index]
}

// Função para formatar data de criação
const formatarDataCriacao = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })
}
</script>
