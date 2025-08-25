<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
    <div class="min-h-screen flex">
      <!-- Coluna da Esquerda - Formulário de Login -->
      <div class="flex-1 flex items-center justify-center px-6 lg:px-12">
        <div class="w-full max-w-md">
          <LoginForm />
        </div>
      </div>

      <!-- Coluna da Direita - Espaço promocional/branding -->
      <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat"></div>
        </div>
        
        <!-- Content -->
        <div class="relative z-10 flex flex-col justify-center px-12 text-white">
          <div class="max-w-md">
            <h1 class="text-5xl font-bold mb-6 leading-tight">
              Sistema de
              <span class="text-secondary-300">Agendamento</span>
            </h1>
            <p class="text-xl text-primary-100 mb-8 leading-relaxed">
              Gerencie seus agendamentos de forma simples e eficiente. 
              Organize sua agenda e otimize seu tempo.
            </p>
            
            <!-- Features List -->
            <ul class="space-y-4">
              <li class="flex items-center text-primary-100">
                <div class="w-2 h-2 bg-secondary-400 rounded-full mr-4"></div>
                Agendamentos em tempo real
              </li>
              <li class="flex items-center text-primary-100">
                <div class="w-2 h-2 bg-secondary-400 rounded-full mr-4"></div>
                Notificações automáticas
              </li>
              <li class="flex items-center text-primary-100">
                <div class="w-2 h-2 bg-secondary-400 rounded-full mr-4"></div>
                Relatórios detalhados
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata
useHead({
  title: 'Login - Sistema de Agendamento',
  meta: [
    {
      name: 'description',
      content: 'Faça login no sistema de agendamento para gerenciar seus compromissos.'
    }
  ]
})
</script>
