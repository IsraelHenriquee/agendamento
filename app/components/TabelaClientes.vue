<template>
  <div class="overflow-x-auto">
    <!-- Botão Adicionar -->
    <div class="mb-6 mt-2 mr-2 flex justify-end">
      <BaseButton 
        variant="primary" 
        size="md"
        @click="emit('adicionar')"
      >
        <PlusIcon class="w-4 h-4 mr-2" />
        Adicionar Cliente
      </BaseButton>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-neutral-600">Carregando clientes...</div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-600">{{ error }}</div>
    </div>

    <!-- Tabela -->
    <table v-else class="min-w-full divide-y divide-neutral-200">
      <thead class="bg-neutral-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
            ID
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Nome
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
            CPF
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Email
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Telefone
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Ações
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-neutral-200">
        <tr v-if="clientes.length === 0">
          <td colspan="6" class="px-6 py-4 text-center text-neutral-500">
            Nenhum cliente encontrado
          </td>
        </tr>
        <tr v-for="cliente in clientes" :key="cliente.id" class="hover:bg-neutral-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
            {{ cliente.id }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
            {{ cliente.nome || '-' }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
            {{ cliente.cpf || '-' }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
            {{ cliente.email || '-' }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
            {{ cliente.telefone || '-' }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
            <div class="flex items-center gap-2">
              <!-- Botão Editar -->
              <button 
                class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar cliente"
                @click="emit('editar', cliente)"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              
              <!-- Botão Deletar -->
              <button 
                class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                title="Deletar cliente"
                @click="emit('deletar', cliente.id)"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/outline'
import type { AgCliente } from '../../shared/types/database'

// Props (se necessário no futuro)
interface Props {}
defineProps<Props>()

// Emits
const emit = defineEmits<{
  'adicionar': []
  'editar': [cliente: AgCliente]
  'deletar': [id: number]
}>()

// Composable
const { fetchClientes } = useProfissionais()

// Estado reativo
const clientes = ref<AgCliente[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Carregar clientes
const loadClientes = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await fetchClientes()
    clientes.value = data
  } catch (err: any) {
    console.error('Erro ao carregar clientes:', err)
    error.value = err.message || 'Erro ao carregar clientes'
  } finally {
    loading.value = false
  }
}

// Carregar dados quando o componente for montado
onMounted(() => {
  loadClientes()
})

// Expor função para componente pai
defineExpose({
  loadClientes,
  clientes: readonly(clientes)
})
</script>
