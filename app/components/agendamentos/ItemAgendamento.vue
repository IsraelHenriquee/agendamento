<template>
  <div class="flex-1 relative bg-neutral-100">
    <!-- Área dos slots de agendamento -->
    <div class="h-full relative">
      <SlotAgendamento
        v-for="agendamento in agendamentosDodia"
        :key="agendamento.id"
        :agendamento="agendamento"
        @editar="$emit('editar-agendamento', $event)"
      />
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
