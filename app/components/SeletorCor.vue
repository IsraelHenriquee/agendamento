<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Cor do Agendamento
    </label>
    
    <!-- Botão para abrir seletor de cores -->
    <div class="relative">
      <button
        type="button"
        class="flex items-center space-x-3 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        @click="mostrarDropdown = !mostrarDropdown"
      >
        <!-- Preview da cor selecionada -->
        <div
          class="w-6 h-6 rounded-full border border-gray-300"
          :style="{ backgroundColor: modelValue }"
        />
        <span class="flex-1 text-left text-sm text-gray-900">{{ corSelecionadaNome }}</span>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <!-- Dropdown com opções de cores -->
      <Teleport to="body">
        <div
          v-if="mostrarDropdown"
          ref="dropdownRef"
          class="fixed z-50 bg-white border border-gray-300 rounded-md shadow-lg p-4 w-80"
          :style="{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }"
        >
          <!-- Cores predefinidas -->
          <div class="mb-4">
            <p class="text-xs font-medium text-gray-700 mb-2">Cores predefinidas</p>
            <div class="grid grid-cols-6 gap-2">
              <button
                v-for="cor in coresPredefinidas"
                :key="cor.valor"
                type="button"
                class="w-8 h-8 rounded-full border-2 transition-all hover:scale-110 focus:outline-none"
                :class="modelValue === cor.valor ? 'border-gray-800 ring-2 ring-blue-500' : 'border-gray-300'"
                :style="{ backgroundColor: cor.valor }"
                :title="cor.nome"
                @click="selecionarCor(cor.valor)"
              />
            </div>
          </div>
          
          <!-- Separador -->
          <div class="border-t border-gray-200 pt-3">
            <p class="text-xs font-medium text-gray-700 mb-2">Cor personalizada</p>
            <div class="flex items-center space-x-3">
              <input
                :value="modelValue"
                type="color"
                class="w-10 h-8 rounded border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                @input="onCorPersonalizada"
              />
              <span class="text-xs text-gray-500 font-mono">{{ modelValue }}</span>
            </div>
          </div>
        </div>
      </Teleport>
      
      <!-- Overlay para fechar dropdown -->
      <Teleport to="body">
        <div
          v-if="mostrarDropdown"
          class="fixed inset-0 z-40"
          @click="mostrarDropdown = false"
        />
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Estado do dropdown
const mostrarDropdown = ref(false)
const dropdownRef = ref<HTMLElement>()

// Cores predefinidas
const coresPredefinidas = [
  { nome: 'Azul Claro', valor: '#DBE9FE' },
  { nome: 'Verde Claro', valor: '#D1FAE5' },
  { nome: 'Amarelo Claro', valor: '#FEF3C7' },
  { nome: 'Rosa Claro', valor: '#FCE7F3' },
  { nome: 'Púrpura Claro', valor: '#EDE9FE' },
  { nome: 'Laranja Claro', valor: '#FED7AA' },
  { nome: 'Vermelho Claro', valor: '#FEE2E2' },
  { nome: 'Cinza Claro', valor: '#F3F4F6' },
  { nome: 'Azul Escuro', valor: '#BFDBFE' },
  { nome: 'Verde Escuro', valor: '#A7F3D0' },
  { nome: 'Amarelo Escuro', valor: '#FDE68A' },
  { nome: 'Rosa Escuro', valor: '#F9A8D4' }
]

// Computed para nome da cor selecionada
const corSelecionadaNome = computed(() => {
  const corPredefinida = coresPredefinidas.find(cor => cor.valor === props.modelValue)
  return corPredefinida ? corPredefinida.nome : 'Cor personalizada'
})

// Funções
const selecionarCor = (valor: string) => {
  emit('update:modelValue', valor)
  mostrarDropdown.value = false
}

const onCorPersonalizada = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
