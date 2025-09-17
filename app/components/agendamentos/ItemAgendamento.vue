<template>
  <div class="flex-1 relative bg-white border-r border-gray-300 last:border-r-0 pb-8">    
    <!-- Área dos slots de agendamento -->
    <div class="h-full relative">
      <SlotAgendamento
        v-for="agendamento in agendamentosDodia"
        :key="agendamento.id"
        :agendamento="agendamento"
        @editar="$emit('editar-agendamento', $event)"
      />
      
      <!-- Indicador quando não há agendamentos (mais sutil) -->
      <div 
        v-if="agendamentosDodia.length === 0" 
        class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-30 transition-opacity duration-300 pointer-events-none"
      >
        <div class="text-gray-300 text-xs">
          <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import do componente SlotAgendamento
import SlotAgendamento from './SlotAgendamento.vue'
import type { AgAgendamento } from '../../../shared/types/database'

interface Props {
  data: Date
  agendamentos: AgAgendamento[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'editar-agendamento': [agendamento: AgAgendamento]
}>()

// Computed para filtrar agendamentos do dia atual
const agendamentosDodia = computed(() => {
  return props.agendamentos.filter(agendamento => {
    if (!agendamento.data) return false
    
    // Usar apenas a parte da data (YYYY-MM-DD) para evitar problemas de fuso horário
    const dataAgendamento = agendamento.data // Já está no formato YYYY-MM-DD
    const dataAtual = props.data.toISOString().split('T')[0] // Converte para YYYY-MM-DD
    
    return dataAgendamento === dataAtual
  })
})
</script>
