<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Cliente *
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
        :placeholder="loading ? 'Carregando clientes...' : 'Digite para pesquisar ou selecione um cliente'"
        :disabled="loading || disabled"
        @input="onPesquisaChange"
        @focus="!disabled && (mostrarDropdown = true)"
        @blur="onBlur"
        required
      />
      
      <!-- Dropdown de resultados -->
      <div
        v-if="mostrarDropdown && clientesFiltrados.length > 0 && !disabled"
        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
      >
        <div
          v-for="cliente in clientesFiltrados"
          :key="cliente.id"
          class="px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm border-b border-gray-100 last:border-b-0"
          @mousedown="selecionarCliente(cliente)"
        >
          <div class="font-medium text-gray-900">{{ cliente.nome }}</div>
          <div v-if="cliente.cpf" class="text-xs text-gray-500">CPF: {{ cliente.cpf }}</div>
          <div v-if="cliente.email" class="text-xs text-blue-600">{{ cliente.email }}</div>
        </div>
        
        <!-- Indicador de mais resultados -->
        <div v-if="clientes.length > 10" class="px-3 py-2 text-xs text-gray-400 bg-gray-50 text-center">
          {{ clientesFiltrados.length === 10 ? 'Continue digitando para refinar a busca' : `${clientesFiltrados.length} resultados` }}
        </div>
      </div>
      
      <!-- Mensagem quando não há resultados -->
      <div
        v-if="mostrarDropdown && pesquisa.length > 0 && clientesFiltrados.length === 0 && !loading && !disabled"
        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-sm text-gray-500"
      >
        Nenhum cliente encontrado para "{{ pesquisa }}"
      </div>
    </div>
    <p class="mt-1 text-xs text-gray-500">
      <span v-if="!disabled">
        Não encontrou o cliente? 
        <a 
          href="#" 
          class="text-blue-600 hover:text-blue-800 font-medium"
          @click.prevent="$emit('cadastrarNovo')"
        >
          Cadastrar novo cliente
        </a>
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { AgCliente } from '../../shared/types/database'

interface Props {
  clientes: AgCliente[]
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
  'cadastrarNovo': []
}>()

// Estado local
const pesquisa = ref('')
const mostrarDropdown = ref(false)
const clienteSelecionado = ref<AgCliente | null>(null)

// Computed para filtrar clientes
const clientesFiltrados = computed(() => {
  if (!pesquisa.value || pesquisa.value.length < 1) {
    return props.clientes.slice(0, 10)
  }
  
  const termo = pesquisa.value.toLowerCase()
  return props.clientes.filter(cliente => 
    cliente.nome?.toLowerCase().includes(termo) || 
    cliente.cpf?.includes(termo) ||
    cliente.email?.toLowerCase().includes(termo)
  ).slice(0, 10)
})

// Funções
const onPesquisaChange = () => {
  if (clienteSelecionado.value && pesquisa.value !== clienteSelecionado.value.nome) {
    clienteSelecionado.value = null
    emit('update:modelValue', '')
  }
  mostrarDropdown.value = true
}

const onBlur = () => {
  setTimeout(() => {
    mostrarDropdown.value = false
  }, 150)
}

const selecionarCliente = (cliente: AgCliente) => {
  clienteSelecionado.value = cliente
  pesquisa.value = cliente.nome || ''
  emit('update:modelValue', cliente.id.toString())
  mostrarDropdown.value = false
}

// Reset quando componente for limpo externamente
watch(() => props.modelValue, (novoValor) => {
  if (!novoValor) {
    pesquisa.value = ''
    clienteSelecionado.value = null
  }
})

// Expor função de reset
defineExpose({
  reset: () => {
    pesquisa.value = ''
    clienteSelecionado.value = null
    mostrarDropdown.value = false
  },
  definirClienteSelecionado: (cliente: AgCliente) => {
    clienteSelecionado.value = cliente
    pesquisa.value = cliente.nome || ''
    mostrarDropdown.value = false
    emit('update:modelValue', cliente.id.toString())
  }
})
</script>
