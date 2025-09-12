<template>
  <NuxtLayout>
    <div class="h-full flex flex-col">
      <!-- Header -->
      <div class="px-0 py-4 flex-shrink-0">
        <h1 class="text-2xl font-bold text-neutral-900">Agendamentos</h1>
      </div>

      <!-- Conteúdo -->
      <div class="flex-1 min-h-0">
        <AgendamentoManager 
          ref="agendamentoManagerRef"
          class="h-full"
        />
      </div>
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
