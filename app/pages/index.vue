<template>
  <NuxtLayout>
    <div style="padding-bottom: 10px;">
      <AgendamentoManager 
        ref="agendamentoManagerRef"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Imports explícitos
import AgendamentoManager from '~/components/agendamentos/AgendamentoManager.vue'

// Configuração da página
useHead({
  title: 'Agendamentos - Sistema de Agendamento',
  meta: [
    { name: 'description', content: 'Gerenciamento de agendamentos do sistema' }
  ]
})

// Store de agendamento
const agendamentoStore = useAgendamentoStore()

// Referência para o componente AgendamentoManager
const agendamentoManagerRef = ref()

// Funções para interagir com o AgendamentoManager (futuras)
// const handleNovoAgendamento = () => { ... }
// const handleEditarAgendamento = (id: number) => { ... }
// const handleDeletarAgendamento = (id: number) => { ... }

// Lifecycle hooks
onMounted(() => {
  console.log('Página de Agendamentos carregada')
  console.log('Data de referência:', agendamentoStore.dataReferencia)
  console.log('Dias da semana:', agendamentoStore.diasSemana)
})
</script>
