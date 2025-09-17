<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo/Cabeçalho -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Sistema de Agendamento</h1>
        <h2 class="text-xl font-semibold text-gray-700">Recuperar Senha</h2>
        <p class="mt-2 text-sm text-gray-600">
          Digite seu email para receber as instruções de recuperação
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Formulário -->
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Campo Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <BaseInput
              id="email"
              v-model="email"
              type="email"
              placeholder="Digite seu email"
              class="w-full"
              autocomplete="email"
              :disabled="isLoading"
            />
          </div>

          <!-- Botão Enviar -->
          <div>
            <BaseButton
              type="submit"
              variant="primary"
              class="w-full justify-center"
              :disabled="!email.trim() || isLoading"
              :loading="isLoading"
            >
              {{ isLoading ? 'Enviando...' : 'Enviar Email de Recuperação' }}
            </BaseButton>
          </div>
        </form>

        <!-- Link para voltar ao login -->
        <div class="mt-6">
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

    <!-- Modal de confirmação -->
    <ModalConfirmacao
      v-model="showModal"
      titulo="Email de Recuperação Enviado"
      mensagem="Se o email informado existir em nosso sistema, você receberá um link de recuperação de senha em breve."
      detalhes="Verifique também sua caixa de spam caso não encontre o email."
      texto-botao-confirmar="Entendi"
      :mostrar-botao-cancelar="false"
      @confirmar="handleModalClose"
    />
  </div>
</template>

<script setup lang="ts">
// Meta da página
useHead({
  title: 'Esqueci Senha - Sistema de Agendamento',
  meta: [
    { name: 'description', content: 'Recuperação de senha do sistema de agendamento' }
  ]
})

// Composables
const { recoverPassword, isLoading, error } = useAuth()

// Estado do formulário
const email = ref('')
const showModal = ref(false)

// Função para envio do formulário
const handleSubmit = async () => {
  if (!email.value.trim()) return

  const { error: recoveryError } = await recoverPassword(email.value.trim())
  
  if (!recoveryError) {
    // Sempre mostrar o modal, independente do email existir ou não (por segurança)
    showModal.value = true
    // Limpar o formulário
    email.value = ''
  }
}

// Função para fechar o modal e redirecionar
const handleModalClose = () => {
  showModal.value = false
  // Redirecionar para login após fechar o modal
  navigateTo('/login')
}
</script>
