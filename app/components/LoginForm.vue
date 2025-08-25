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
        required
        :icon-left="AtSymbolIcon"
      />

      <!-- Password Field -->
      <BaseInput
        v-model="password"
        type="password"
        label="Senha"
        placeholder="Digite sua senha"
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
      >
        Entrar
      </BaseButton>
    </form>

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

// Form data
const email = ref('')
const password = ref('')

const handleSubmit = () => {
  // TODO: Implementar lógica de login
  console.log('Form submitted:', { email: email.value, password: password.value })
}
</script>
