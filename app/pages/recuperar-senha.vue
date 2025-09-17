<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo/Cabeçalho -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Sistema de Agendamento</h1>
        <h2 class="text-xl font-semibold text-gray-700">Nova Senha</h2>
        <p class="mt-2 text-sm text-gray-600">
          Defina uma nova senha para sua conta
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Componente de alteração de senha -->
        <ChangePassword />
        
        <!-- Link para voltar ao login -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="text-center">
            <NuxtLink 
              to="/login"
              class="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              ← Voltar para o Login
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta da página
useHead({
  title: 'Recuperar Senha - Sistema de Agendamento',
  meta: [
    { name: 'description', content: 'Definir nova senha do sistema de agendamento' }
  ]
})

// Verificar se há parâmetros de recuperação na URL
const route = useRoute()

// Log para debug (remover em produção)
console.log('Parâmetros da URL para recuperação:', route.query)
</script>
