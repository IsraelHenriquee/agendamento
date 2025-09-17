<template>
  <form @submit.prevent="changePassword" class="space-y-6">
    <!-- Nova Senha -->
    <div>
      <label class="block text-sm font-medium text-neutral-700 mb-2">
        Nova Senha *
      </label>
      <BaseInput
        v-model="newPassword"
        type="password"
        placeholder="Digite sua nova senha"
        :error="errors.newPassword"
        class="w-full"
        autocomplete="new-password"
      />
      <p v-if="errors.newPassword" class="text-sm text-danger-600 mt-1">
        {{ errors.newPassword }}
      </p>
      
      <!-- Indicador de força da senha -->
      <div v-if="newPassword" class="mt-2">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-medium text-neutral-700">Força da senha:</span>
          <span 
            class="text-xs font-semibold"
            :class="passwordStrengthColor"
          >
            {{ passwordStrengthText }}
          </span>
        </div>
        <div class="w-full bg-neutral-200 rounded-full h-1.5">
          <div 
            class="h-1.5 rounded-full transition-all duration-300"
            :class="passwordStrengthColor"
            :style="{ width: `${passwordStrengthPercentage}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Confirmar Nova Senha -->
    <div>
      <label class="block text-sm font-medium text-neutral-700 mb-2">
        Confirmar Nova Senha *
      </label>
      <BaseInput
        v-model="confirmPassword"
        type="password"
        placeholder="Confirme sua nova senha"
        :error="errors.confirmPassword"
        class="w-full"
        autocomplete="new-password"
      />
      <p v-if="errors.confirmPassword" class="text-sm text-danger-600 mt-1">
        {{ errors.confirmPassword }}
      </p>
    </div>

    <!-- Requisitos da senha -->
    <div class="bg-neutral-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-neutral-900 mb-2">Requisitos da senha:</h4>
      <ul class="space-y-1">
        <li class="flex items-center gap-2 text-xs">
          <div 
            class="w-1.5 h-1.5 rounded-full"
            :class="passwordRequirements.minLength ? 'bg-success-500' : 'bg-neutral-300'"
          ></div>
          <span :class="passwordRequirements.minLength ? 'text-success-700' : 'text-neutral-600'">
            Pelo menos 6 caracteres
          </span>
        </li>
      </ul>
    </div>

    <!-- Botões de Ação -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
      <BaseButton
        variant="secondary"
        @click="resetForm"
        :disabled="isLoading || !hasAnyValue"
      >
        Limpar
      </BaseButton>
      <BaseButton
        variant="primary"
        type="submit"
        :disabled="!isFormValid || isLoading"
        :loading="isLoading"
      >
        Alterar Senha
      </BaseButton>
    </div>

    <!-- Mensagem de sucesso -->
    <div 
      v-if="successMessage" 
      class="bg-success-50 border border-success-200 rounded-lg p-4 mt-4"
    >
      <div class="flex items-center">
        <CheckCircleIcon class="w-5 h-5 text-success-500 mr-2" />
        <span class="text-success-700">{{ successMessage }}</span>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

// Composables
const { changePassword: updatePassword } = useAuth()
const { showSuccess, showError } = useNotification()
const route = useRoute()

// Estado do formulário
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const successMessage = ref('')

// Erros de validação
const errors = reactive({
  newPassword: '',
  confirmPassword: ''
})

// Computed para verificar se algum campo tem valor
const hasAnyValue = computed(() => {
  return newPassword.value || confirmPassword.value
})

// Computed para requisitos da senha
const passwordRequirements = computed(() => ({
  minLength: newPassword.value.length >= 6
}))

// Computed para força da senha
const passwordStrength = computed(() => {
  if (!newPassword.value) return 0
  
  // Apenas 1 requisito: tamanho mínimo
  let score = 0
  if (passwordRequirements.value.minLength) score = 4 // Força máxima se atender requisito mínimo
  
  return score
})

const passwordStrengthPercentage = computed(() => {
  return (passwordStrength.value / 4) * 100
})

const passwordStrengthText = computed(() => {
  if (passwordStrength.value > 0) return 'Válida'
  return 'Muito curta'
})

const passwordStrengthColor = computed(() => {
  if (passwordStrength.value > 0) return 'text-success-600 bg-success-500'
  return 'text-danger-600 bg-danger-500'
})

// Computed para validar o formulário
const isFormValid = computed(() => {
  return (
    newPassword.value.length >= 6 &&
    confirmPassword.value === newPassword.value &&
    !errors.newPassword &&
    !errors.confirmPassword
  )
})

// Validações reativas
watch(newPassword, (value) => {
  errors.newPassword = ''
  if (value && value.length < 6) {
    errors.newPassword = 'A senha deve ter pelo menos 6 caracteres'
  }
})

watch(confirmPassword, (value) => {
  errors.confirmPassword = ''
  if (value && value !== newPassword.value) {
    errors.confirmPassword = 'As senhas não coincidem'
  }
})

// Função para limpar o formulário
const resetForm = () => {
  newPassword.value = ''
  confirmPassword.value = ''
  successMessage.value = ''
  
  // Limpar erros
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

// Função para alterar a senha
const changePassword = async () => {
  try {
    isLoading.value = true
    successMessage.value = ''
    
    // Limpar erros anteriores
    Object.keys(errors).forEach(key => {
      errors[key as keyof typeof errors] = ''
    })
    
    // Chamar a função do composable
    const { data, error } = await updatePassword(newPassword.value)
    
    if (error) {
      throw error
    }
    
    // Sucesso
    successMessage.value = 'Senha alterada com sucesso!'
    showSuccess('Senha alterada com sucesso!')
    
    // Redirecionar apenas se estivermos na página de recuperação de senha
    if (route.path === '/recuperar-senha') {
      setTimeout(async () => {
        await navigateTo('/')
      }, 1500)
    }
    
  } catch (error: any) {
    console.error('Erro ao alterar senha:', error)
    const errorMessage = error.message || 'Erro ao alterar senha'
    errors.newPassword = errorMessage
    showError(errorMessage)
  } finally {
    isLoading.value = false
  }
}
</script>
