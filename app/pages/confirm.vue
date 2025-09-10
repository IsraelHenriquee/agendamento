<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
    <div class="bg-white p-8 rounded-2xl shadow-card max-w-md w-full text-center">
      <div class="mb-6">
        <div class="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-neutral-800 mb-2">
          Aguardando confirmação...
        </h1>
        <p class="text-neutral-600">
          Processando seu login. Você será redirecionado em instantes.
        </p>
      </div>
      
      <div class="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()

// Redirecionar quando o usuário estiver logado
watch(user, () => {
  if (user.value) {
    const path = redirectInfo.pluck() // Pega e limpa o cookie
    return navigateTo(path || '/')
  }
}, { immediate: true })

// Meta tags
useHead({
  title: 'Confirmando login - Sistema de Agendamento'
})
</script>
