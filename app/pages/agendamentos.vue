<template>
  <NuxtLayout>
    <!-- Header -->
    <div class="px-6 py-4">
      <h1 class="text-2xl font-bold text-neutral-900">Agendamentos</h1>
    </div>

    <!-- Conteúdo -->
    <div class="p-6">
      <ListaAgendamentos />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import ListaAgendamentos from '../components/ListaAgendamentos.vue'

// Configuração da página
useHead({
  title: 'Agendamentos - Sistema de Agendamento',
  meta: [
    { name: 'description', content: 'Gerenciamento de agendamentos do sistema de agendamento' }
  ]
})
</script>
