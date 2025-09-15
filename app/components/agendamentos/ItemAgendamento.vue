<template>
  <div class="flex-1 relative bg-neutral-100">
    <!-- Área dos slots de agendamento -->
    <div class="h-full relative">
      <SlotAgendamento
        v-for="agendamento in agendamentosDodia"
        :key="agendamento.id"
        :agendamento="agendamento"
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

// Computed para filtrar agendamentos do dia atual
const agendamentosDodia = computed(() => {
  return props.agendamentos.filter(agendamento => {
    if (!agendamento.data) return false
    
    const dataAgendamento = new Date(agendamento.data)
    const diaAgendamento = dataAgendamento.getDate()
    const mesAgendamento = dataAgendamento.getMonth()
    const anoAgendamento = dataAgendamento.getFullYear()
    
    const diaAtual = props.data.getDate()
    const mesAtual = props.data.getMonth()
    const anoAtual = props.data.getFullYear()
    
    return diaAgendamento === diaAtual && 
           mesAgendamento === mesAtual && 
           anoAgendamento === anoAtual
  })
})
</script>
