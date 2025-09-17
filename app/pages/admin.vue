<template>
    <NuxtLayout>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Administração</h1>
      <p class="text-gray-600 mt-2">Painel de administração do sistema</p>
    </div>

    <!-- Tabela de Usuários -->
    <TabelaAdmin />
  </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Aplicar middleware de admin
definePageMeta({
  middleware: 'admin'
})

// Meta da página
useHead({
  title: 'Administração - Sistema de Agendamento',
  meta: [
    { name: 'description', content: 'Painel de administração do sistema de agendamento' }
  ]
})
</script>
