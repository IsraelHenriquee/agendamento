<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Profissional
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        v-model="pesquisa"
        type="text"
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        :placeholder="loading ? 'Carregando profissionais...' : 'Digite para pesquisar ou selecione um profissional'"
        :disabled="loading || disabled"
        @input="onPesquisaChange"
        @focus="!disabled && (mostrarDropdown = true)"
        @blur="onBlur"
      />
      
      <!-- Botão para limpar seleção -->
      <button
        v-if="profissionalSelecionado"
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
        @click="limparSelecao"
      >
        <svg class="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <!-- Dropdown de resultados -->
      <div
        v-if="mostrarDropdown && profissionaisFiltrados.length > 0 && !disabled"
        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
      >
        <div
          v-for="profissional in profissionaisFiltrados"
          :key="profissional.profissional_id"
          class="px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm border-b border-gray-100 last:border-b-0"
          @mousedown="selecionarProfissional(profissional)"
        >
          <div class="flex items-center space-x-3">
            <!-- Avatar -->
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold bg-blue-500"
            >
              {{ profissional.nome ? profissional.nome.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : '?' }}
            </div>
            <div class="flex-1">
              <div class="font-medium text-gray-900">{{ profissional.nome }}</div>
              <div v-if="profissional.especialidade" class="text-xs text-gray-500">{{ profissional.especialidade }}</div>
            </div>
          </div>
        </div>
        
        <!-- Indicador de mais resultados -->
        <div v-if="profissionais.length > 10" class="px-3 py-2 text-xs text-gray-400 bg-gray-50 text-center">
          {{ profissionaisFiltrados.length === 10 ? 'Continue digitando para refinar a busca' : `${profissionaisFiltrados.length} resultados` }}
        </div>
      </div>
      
      <!-- Mensagem quando não há resultados -->
      <div
        v-if="mostrarDropdown && pesquisa.length > 0 && profissionaisFiltrados.length === 0 && !loading && !disabled"
        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-sm text-gray-500"
      >
        Nenhum profissional encontrado para "{{ pesquisa }}"
      </div>
    </div>
    <p class="mt-1 text-xs text-gray-500">
      <span v-if="!disabled">
        Selecione um profissional para filtrar os agendamentos
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { AgProfissional } from '../../shared/types/database'

interface Props {
  profissionais: AgProfissional[]
  loading?: boolean
  modelValue: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Estado local
const pesquisa = ref('')
const mostrarDropdown = ref(false)
const profissionalSelecionado = ref<AgProfissional | null>(null)

// Computed para filtrar profissionais
const profissionaisFiltrados = computed(() => {
  if (!pesquisa.value || pesquisa.value.length < 1) {
    return props.profissionais.slice(0, 10)
  }
  
  const termo = pesquisa.value.toLowerCase()
  return props.profissionais.filter(profissional => 
    profissional.nome?.toLowerCase().includes(termo) || 
    profissional.especialidade?.toLowerCase().includes(termo)
  ).slice(0, 10)
})

// Funções
const onPesquisaChange = () => {
  if (profissionalSelecionado.value && pesquisa.value !== profissionalSelecionado.value.nome) {
    profissionalSelecionado.value = null
    emit('update:modelValue', '')
  }
  mostrarDropdown.value = true
}

const onBlur = () => {
  setTimeout(() => {
    mostrarDropdown.value = false
  }, 150)
}

const selecionarProfissional = (profissional: AgProfissional) => {
  profissionalSelecionado.value = profissional
  pesquisa.value = profissional.nome || ''
  emit('update:modelValue', profissional.profissional_id.toString())
  mostrarDropdown.value = false
}

const limparSelecao = () => {
  profissionalSelecionado.value = null
  pesquisa.value = ''
  emit('update:modelValue', '')
}

// Reset quando componente for limpo externamente
watch(() => props.modelValue, (novoValor) => {
  if (!novoValor) {
    pesquisa.value = ''
    profissionalSelecionado.value = null
  }
})

// Expor função de reset
defineExpose({
  reset: () => {
    pesquisa.value = ''
    profissionalSelecionado.value = null
    mostrarDropdown.value = false
  },
  definirProfissionalSelecionado: (profissional: AgProfissional) => {
    profissionalSelecionado.value = profissional
    pesquisa.value = profissional.nome || ''
    mostrarDropdown.value = false
    emit('update:modelValue', profissional.profissional_id.toString())
  }
})
</script>
