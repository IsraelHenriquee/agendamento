<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Sistema de
          <span class="text-blue-600">Agendamento</span>
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Teste do Tailwind CSS com componentes responsivos e gradientes
        </p>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <!-- Card 1 -->
        <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
          <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Agendamentos</h3>
          <p class="text-gray-600">Gerencie seus compromissos de forma simples e eficiente</p>
        </div>

        <!-- Card 2 -->
        <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
          <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Clientes</h3>
          <p class="text-gray-600">Mantenha um cadastro completo de seus clientes</p>
        </div>

        <!-- Card 3 -->
        <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
          <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Relatórios</h3>
          <p class="text-gray-600">Acompanhe métricas e performance do seu negócio</p>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center">
        <div class="inline-flex flex-col sm:flex-row gap-4">
          <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
            Começar Agora
          </button>
          <button class="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-lg border-2 border-blue-600 transition-colors duration-200">
            Saiba Mais
          </button>
        </div>
      </div>

      <!-- Features List -->
      <div class="mt-16 bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
          Recursos Principais
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-700">Interface responsiva</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-700">Design moderno</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-700">Componentes reutilizáveis</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-700">Tailwind CSS integrado</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuração da página
useHead({
  title: 'Sistema de Agendamento - Página Inicial',
  meta: [
    { name: 'description', content: 'Sistema de agendamento moderno e responsivo' }
  ]
})
</script>
