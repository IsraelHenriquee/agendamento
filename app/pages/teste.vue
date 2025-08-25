<template>
  <div class="min-h-screen bg-neutral-50 py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-neutral-900 mb-4">
          Componentes de Teste
        </h1>
        <p class="text-lg text-neutral-600">
          Avaliação dos componentes BaseButton e BaseInput
        </p>
      </div>

      <!-- BaseButton Tests -->
      <div class="bg-white rounded-2xl shadow-card p-8 mb-8">
        <h2 class="text-2xl font-semibold text-neutral-900 mb-6">
          BaseButton - Variações
        </h2>

        <!-- Button Variants -->
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-medium text-neutral-700 mb-4">Variantes de Cor</h3>
            <div class="flex flex-wrap gap-4">
              <BaseButton variant="primary">Primary</BaseButton>
              <BaseButton variant="secondary">Secondary</BaseButton>
              <BaseButton variant="outline">Outline</BaseButton>
              <BaseButton variant="ghost">Ghost</BaseButton>
              <BaseButton variant="danger">Danger</BaseButton>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-neutral-700 mb-4">Tamanhos</h3>
            <div class="flex flex-wrap items-center gap-4">
              <BaseButton size="sm">Small</BaseButton>
              <BaseButton size="md">Medium</BaseButton>
              <BaseButton size="lg">Large</BaseButton>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-neutral-700 mb-4">Estados</h3>
            <div class="flex flex-wrap gap-4">
              <BaseButton>Normal</BaseButton>
              <BaseButton disabled>Disabled</BaseButton>
              <BaseButton :loading="isLoading" @click="toggleLoading">
                {{ isLoading ? 'Loading...' : 'Click to Load' }}
              </BaseButton>
              <BaseButton variant="secondary" @click="showToastSuccess">
                Toast Success
              </BaseButton>
              <BaseButton variant="danger" @click="showToastError">
                Toast Error
              </BaseButton>
              <BaseButton variant="outline" @click="showToastWarning">
                Toast Warning
              </BaseButton>
              <BaseButton variant="ghost" @click="showToastInfo">
                Toast Info
              </BaseButton>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-neutral-700 mb-4">Full Width</h3>
            <BaseButton variant="primary" full-width>
              Botão com largura total
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- BaseInput Tests -->
      <div class="bg-white rounded-2xl shadow-card p-8 mb-8">
        <h2 class="text-2xl font-semibold text-neutral-900 mb-6">
          BaseInput - Variações
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Inputs -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-neutral-700">Inputs Básicos</h3>
            
            <BaseInput
              v-model="testInputs.basic"
              label="Input Básico"
              placeholder="Digite algo..."
              helper-text="Este é um input básico"
            />

            <BaseInput
              v-model="testInputs.required"
              label="Campo Obrigatório"
              placeholder="Campo obrigatório"
              required
            />

            <BaseInput
              v-model="testInputs.email"
              type="email"
              label="E-mail"
              placeholder="seu@email.com"
            />

            <BaseInput
              v-model="testInputs.password"
              type="password"
              label="Senha"
              placeholder="••••••••"
            />
          </div>

          <!-- Advanced Inputs -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-neutral-700">Inputs Avançados</h3>

            <BaseInput
              v-model="testInputs.withIcons"
              label="Input com Ícones"
              placeholder="Buscar..."
              :icon-left="MagnifyingGlassIcon"
              helper-text="Input com ícone à esquerda"
            />

            <BaseInput
              v-model="testInputs.withError"
              label="Input com Erro"
              placeholder="Digite algo inválido"
              error-message="Este campo contém um erro"
            />

            <BaseInput
              v-model="testInputs.disabled"
              label="Input Desabilitado"
              placeholder="Não editável"
              disabled
            />

            <BaseInput
              v-model="testInputs.readonly"
              label="Input Readonly"
              placeholder="Apenas leitura"
              readonly
            />

            <BaseInput
              v-model="testInputs.number"
              type="number"
              label="Número"
              placeholder="123"
            />
          </div>
        </div>

        <!-- Input Sizes -->
        <div class="mt-8">
          <h3 class="text-lg font-medium text-neutral-700 mb-4">Tamanhos</h3>
          <div class="space-y-4">
            <BaseInput
              v-model="testInputs.small"
              size="sm"
              label="Small"
              placeholder="Input pequeno"
            />
            <BaseInput
              v-model="testInputs.medium"
              size="md"
              label="Medium"
              placeholder="Input médio"
            />
            <BaseInput
              v-model="testInputs.large"
              size="lg"
              label="Large"
              placeholder="Input grande"
            />
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="bg-white rounded-2xl shadow-card p-8">
        <h2 class="text-2xl font-semibold text-neutral-900 mb-6">
          Exemplo de Formulário
        </h2>

        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput
              v-model="formData.name"
              label="Nome Completo"
              placeholder="Seu nome"
              :icon-left="UserIcon"
              required
            />
            <BaseInput
              v-model="formData.email"
              type="email"
              label="E-mail"
              placeholder="seu@email.com"
              :icon-left="EnvelopeIcon"
              required
            />
          </div>

          <BaseInput
            v-model="formData.phone"
            type="tel"
            label="Telefone"
            placeholder="(11) 99999-9999"
            :icon-left="PhoneIcon"
          />

          <div class="flex gap-4">
            <BaseButton type="submit" variant="primary">
              Salvar
            </BaseButton>
            <BaseButton type="button" variant="outline" @click="resetForm">
              Limpar
            </BaseButton>
          </div>
        </form>
      </div>

      <!-- Values Display -->
      <div class="bg-neutral-100 rounded-2xl p-6 mt-8">
        <h3 class="text-lg font-semibold text-neutral-900 mb-4">
          Valores dos Inputs (Debug)
        </h3>
        <pre class="text-sm text-neutral-700 bg-white p-4 rounded-lg overflow-auto">{{ JSON.stringify({ testInputs, formData }, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserIcon, EnvelopeIcon, PhoneIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

// Page meta
useHead({
  title: 'Teste de Componentes - Sistema de Agendamento',
  meta: [
    { name: 'description', content: 'Página de teste para componentes BaseButton e BaseInput' }
  ]
})

// Notification composable
const { showSuccess, showError, showWarning, showInfo } = useNotification()

// Loading state for button
const isLoading = ref(false)

const toggleLoading = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}

// Toast functions
const showToastSuccess = () => {
  showSuccess('Operação realizada com sucesso!')
}

const showToastError = () => {
  showError('Ops! Algo deu errado.')
}

const showToastWarning = () => {
  showWarning('Atenção: Verifique os dados.')
}

const showToastInfo = () => {
  showInfo('Informação importante.')
}

// Test inputs reactive data
const testInputs = reactive({
  basic: '',
  required: '',
  email: '',
  password: '',
  withIcons: '',
  withError: 'Valor inválido',
  disabled: 'Valor fixo',
  readonly: 'Não editável',
  number: 0,
  small: '',
  medium: '',
  large: ''
})

// Form data
const formData = reactive({
  name: '',
  email: '',
  phone: ''
})

const handleSubmit = () => {
  console.log('Form submitted:', formData)
  showSuccess('Formulário enviado com sucesso! 🎉')
}

const resetForm = () => {
  formData.name = ''
  formData.email = ''
  formData.phone = ''
}
</script>
