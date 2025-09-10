<template>
  <NuxtLayout>
    <div class="flex items-center justify-center min-h-96">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-neutral-900 mb-4">Dashboard</h1>
        
        <!-- Teste: Nome do usuário do Pinia -->
        <div v-if="userStore.loading" class="text-neutral-600">
          Carregando perfil...
        </div>
        <div v-else-if="userStore.error" class="text-red-600">
          Erro: {{ userStore.error }}
        </div>
        <div v-else-if="userStore.profile?.nome" class="text-lg text-neutral-700">
          Olá, <span class="font-semibold">{{ userStore.profile.nome }}</span>!
        </div>
        <div v-else class="text-neutral-500">
          Perfil não encontrado
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Store do usuário
const userStore = useUserStore()

// Configuração da página
useHead({
  title: 'Dashboard - Sistema de Agendamento',
  meta: [
    { name: 'description', content: 'Dashboard principal do sistema de agendamento' }
  ]
})
</script>
