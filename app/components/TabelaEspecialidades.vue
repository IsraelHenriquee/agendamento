<template>
  <div class="overflow-x-auto">
    <!-- Botão Adicionar -->
    <div class="mb-6 mt-2 mr-2 flex justify-end">
      <BaseButton 
        variant="primary" 
        size="md"
        :disabled="!isAdmin"
        @click="emit('adicionar')"
      >
        <PlusIcon class="w-4 h-4 mr-2" />
        Adicionar Especialidade
      </BaseButton>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-neutral-600">Carregando especialidades...</div>
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
            Especialidade
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Ações
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-neutral-200">
        <tr v-if="especialidades.length === 0">
          <td colspan="3" class="px-6 py-4 text-center text-neutral-500">
            Nenhuma especialidade encontrada
          </td>
        </tr>
        <tr v-for="especialidade in especialidades" :key="especialidade.id" class="hover:bg-neutral-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
            {{ especialidade.id }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
            {{ especialidade.especialidade }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
            <div class="flex items-center gap-2">
              <!-- Botão Editar -->
              <button 
                class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Editar especialidade"
                :disabled="!isAdmin"
                @click="emit('editar', especialidade.id)"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              
              <!-- Botão Deletar -->
              <button 
                class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Deletar especialidade"
                :disabled="!isAdmin"
                @click="emit('deletar', especialidade.id)"
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
import type { AgEspecialidade } from '../../shared/types/database'

// Props (se necessário no futuro)
interface Props {}
defineProps<Props>()

// Emits
const emit = defineEmits<{
  'adicionar': []
  'editar': [id: number]
  'deletar': [id: number]
}>()

// Composable
const { fetchEspecialidades } = useProfissionais()

// Store do usuário para verificar permissões
const userStore = useUserStore()
const isAdmin = computed(() => userStore.profile?.role === 'admin')

// Estado reativo
const especialidades = ref<AgEspecialidade[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Carregar especialidades
const loadEspecialidades = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await fetchEspecialidades()
    especialidades.value = data
  } catch (err: any) {
    console.error('Erro ao carregar especialidades:', err)
    error.value = err.message || 'Erro ao carregar especialidades'
  } finally {
    loading.value = false
  }
}

// Carregar dados quando o componente for montado
onMounted(() => {
  loadEspecialidades()
})

// Expor função para componente pai
defineExpose({
  loadEspecialidades
})
</script>
