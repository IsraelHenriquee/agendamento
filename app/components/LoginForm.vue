<template>
  <div class="bg-white p-8 rounded-2xl shadow-card w-full max-w-md">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-neutral-800 mb-2">
        Bem-vindo de volta
      </h2>
      <p class="text-neutral-600">
        Entre com suas credenciais para acessar sua conta
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Email Field -->
      <BaseInput
        v-model="email"
        type="email"
        label="E-mail"
        placeholder="seu@email.com"
        autocomplete="email"
        required
        :icon-left="AtSymbolIcon"
      />

      <!-- Password Field -->
      <BaseInput
        v-model="password"
        type="password"
        label="Senha"
        placeholder="Digite sua senha"
        autocomplete="current-password"
        required
        :icon-left="LockClosedIcon"
      />

      <!-- Login Button -->
      <BaseButton
        type="submit"
        variant="primary"
        size="lg"
        full-width
        class="mt-8"
        :loading="isLoading"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Entrando...' : 'Entrar' }}
      </BaseButton>
    </form>

    <!-- Error Message -->
    <div v-if="authError" class="mt-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
      <p class="text-sm text-danger-600">
        {{ authError }}
      </p>
    </div>

    <!-- Additional Links -->
    <div class="mt-6 text-center">
      <a href="#" class="text-sm text-primary-600 hover:text-primary-700 transition-colors">
        Esqueceu sua senha?
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AtSymbolIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

// Composable de autenticação
const { login, isLoading, error: authError } = useAuth()

// Form data
const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    return
  }

  await login(email.value, password.value)
}
</script>
