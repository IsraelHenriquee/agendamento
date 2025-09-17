<template>
  <NuxtLayout>
    <!-- Header -->
    <div class="px-6 py-4">
      <h1 class="text-2xl font-bold text-neutral-900">Perfil</h1>
    </div>

    <!-- Conteúdo -->
    <div class="p-6">
      <!-- Loading State -->
      <div v-if="userStore.loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span class="ml-3 text-neutral-600">Carregando perfil...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="userStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <ExclamationTriangleIcon class="w-5 h-5 text-red-500 mr-2" />
          <span class="text-red-700">{{ userStore.error }}</span>
        </div>
      </div>

      <!-- Conteúdo Principal -->
      <div v-else class="w-full">
        <!-- Card de Informações Pessoais -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Informações Pessoais</h2>

          <div class="space-y-6">
            <!-- Nome (Editável) -->
            <div>
              <label for="nome" class="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <BaseInput
                id="nome"
                v-model="editableNome"
                placeholder="Digite seu nome"
                class="w-full"
              />
            </div>

            <!-- Email (Readonly) -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <BaseInput
                id="email"
                :model-value="user?.email || ''"
                placeholder="Não informado"
                readonly
                class="w-full bg-gray-50"
              />
            </div>
          </div>

          <!-- Botões de Ação -->
          <div class="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <BaseButton
              variant="secondary"
              @click="resetNome"
              :disabled="!hasNomeChanged"
            >
              Cancelar
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="saveNome"
              :disabled="!hasNomeChanged"
              :loading="isSavingNome"
            >
              Salvar
            </BaseButton>
          </div>
        </div>

        <!-- Card de Mudança de Senha -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Alterar Senha</h2>
          
          <ChangePassword />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

// Configuração da página
useHead({
  title: 'Perfil - Sistema de Agendamento',
  meta: [
    { name: 'description', content: 'Perfil do usuário' }
  ]
})

// Composables e stores
const { user, updateUserName } = useAuth()
const userStore = useUserStore()
const { showSuccess, showError } = useNotification()

// Estado local para edição do nome
const editableNome = ref('')
const isSavingNome = ref(false)

// Computed para verificar se o nome foi alterado
const hasNomeChanged = computed(() => {
  return editableNome.value !== (userStore.profile?.nome || '')
})

// Inicializar nome editável quando o perfil carregar
watch(() => userStore.profile?.nome, (newNome) => {
  if (newNome) {
    editableNome.value = newNome
  }
}, { immediate: true })

// Função para resetar o nome
const resetNome = () => {
  editableNome.value = userStore.profile?.nome || ''
}

// Função para salvar o nome
const saveNome = async () => {
  try {
    isSavingNome.value = true
    
    // Chamar a função do composable
    const { data, error } = await updateUserName(editableNome.value)
    
    if (error) {
      throw error
    }
    
    // Verificar resposta da função
    if (data?.success) {
      showSuccess(data.message || 'Nome alterado com sucesso!')
      
      // Recarregar o perfil para obter os dados atualizados
      await userStore.fetchProfile()
    } else {
      throw new Error(data?.message || 'Erro ao alterar nome')
    }
    
  } catch (error: any) {
    console.error('Erro ao salvar nome:', error)
    showError(error.message || 'Erro ao alterar nome')
  } finally {
    isSavingNome.value = false
  }
}
</script>
