<template>
  <BaseModal
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    titulo="Selecionar Profissional"
    :mostrarBotaoConfirmar="false"
    :mostrarBotaoCancelar="false"
    :fecharAoClicarFora="true"
  >
    <!-- Lista de profissionais -->
    <div class="max-h-96 overflow-y-auto">
      <template v-if="loading">
        <div class="space-y-3">
          <div 
            v-for="i in 3" 
            :key="i"
            class="animate-pulse flex items-center p-3 rounded-lg border"
          >
            <div class="w-10 h-10 bg-neutral-300 rounded-full mr-3"></div>
            <div class="flex-1">
              <div class="h-4 bg-neutral-300 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-neutral-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="error">
        <div class="text-center py-8">
          <p class="text-red-500 mb-4">{{ error }}</p>
          <BaseButton 
            variant="secondary"
            @click="$emit('recarregar')"
          >
            Tentar Novamente
          </BaseButton>
        </div>
      </template>

      <template v-else-if="profissionais.length === 0">
        <div class="text-center py-8">
          <p class="text-neutral-500">Nenhum profissional encontrado</p>
        </div>
      </template>

      <template v-else>
        <div class="space-y-2">
          <div
            v-for="profissional in profissionais"
            :key="profissional.profissional_id"
            class="flex items-center p-3 rounded-lg border cursor-pointer transition-colors"
            :class="[
              profissionalSelecionado?.profissional_id === profissional.profissional_id
                ? 'border-blue-500 bg-blue-50'
                : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
            ]"
            @click="selecionarProfissional(profissional)"
          >
            <!-- Avatar (inicial do nome) -->
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3"
              :style="{ backgroundColor: gerarCorAvatar(profissional.nome) }"
            >
              {{ profissional.nome.charAt(0).toUpperCase() }}
            </div>

            <!-- Informações do profissional -->
            <div class="flex-1">
              <h4 class="font-medium text-neutral-800">
                {{ profissional.nome }}
              </h4>
              <p class="text-sm text-neutral-500">
                {{ profissional.especialidade }}
              </p>
            </div>

            <!-- Indicador de seleção -->
            <div 
              v-if="profissionalSelecionado?.profissional_id === profissional.profissional_id"
              class="w-5 h-5 text-blue-500"
            >
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </template>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import type { AgProfissional } from '../../shared/types/database'

interface Props {
  modelValue: boolean
  profissionais: AgProfissional[]
  profissionalSelecionado: AgProfissional | null
  loading?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'selecionar': [profissional: AgProfissional]
  'recarregar': []
}>()

// Função para selecionar um profissional
const selecionarProfissional = (profissional: AgProfissional) => {
  emit('selecionar', profissional)
  emit('update:modelValue', false)
}

// Função para gerar cor do avatar baseada no nome
const gerarCorAvatar = (nome: string) => {
  const cores = [
    '#EF4444', // red-500
    '#F97316', // orange-500
    '#EAB308', // yellow-500
    '#22C55E', // green-500
    '#06B6D4', // cyan-500
    '#3B82F6', // blue-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#64748B', // slate-500
    '#059669', // emerald-600
  ]
  
  // Usar o código do primeiro caractere para escolher uma cor
  const index = nome.charCodeAt(0) % cores.length
  return cores[index]
}
</script>
