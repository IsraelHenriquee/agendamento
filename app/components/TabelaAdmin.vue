<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Cabeçalho -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-gray-900">Usuários do Sistema</h3>
          <p class="text-sm text-gray-500 mt-1">Lista de todos os usuários cadastrados</p>
        </div>
        <BaseButton
          variant="primary"
          @click="mostrarModalNovoUsuario = true"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Novo Usuário
        </BaseButton>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="p-6">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span class="ml-2 text-gray-600">Carregando usuários...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="p-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Erro ao carregar usuários</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div v-else-if="perfis.length > 0" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data de Criação
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="perfil in perfis" :key="perfil.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ perfil.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ perfil.nome || 'Nome não informado' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ perfil.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="{
                  'bg-red-100 text-red-800': perfil.role === 'admin',
                  'bg-blue-100 text-blue-800': perfil.role === 'user',
                  'bg-gray-100 text-gray-800': !perfil.role
                }"
              >
                {{ perfil.role || 'Sem role' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(perfil.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="confirmarDeleção(perfil)"
                class="text-red-600 hover:text-red-900 transition-colors duration-200"
                title="Deletar usuário"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="p-6 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
        <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
      <p class="mt-1 text-sm text-gray-500">Não há usuários cadastrados no sistema.</p>
    </div>

    <!-- Modal Novo Usuário -->
    <ModalNovoUsuario
      v-model="mostrarModalNovoUsuario"
      @usuario-criado="handleUsuarioCriado"
    />

    <!-- Modal Confirmação de Deleção -->
    <ModalConfirmacao
      v-model="mostrarModalConfirmacao"
      titulo="Deletar Usuário"
      :mensagem="`Tem certeza que deseja deletar o usuário '${usuarioParaDeletar?.nome || usuarioParaDeletar?.email}'?`"
      detalhes="Esta ação não pode ser desfeita. O usuário será removido permanentemente do sistema."
      texto-botao-confirmar="Deletar"
      texto-botao-cancelar="Cancelar"
      @confirmar="executarDeleção"
    />
  </div>
</template>

<script setup lang="ts">
import type { AgPerfil } from '../../shared/types/database'

// Composables
const { fetchPerfis } = useProfissionais()
const { deleteUser } = useAuth()
const { showSuccess, showError } = useNotification()

// Estado
const perfis = ref<AgPerfil[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const mostrarModalNovoUsuario = ref(false)
const mostrarModalConfirmacao = ref(false)
const usuarioParaDeletar = ref<AgPerfil | null>(null)

// Função para formatar data
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Data inválida'
  }
}

// Buscar perfis quando o componente for montado
const loadPerfis = async () => {
  try {
    loading.value = true
    error.value = null
    
    const data = await fetchPerfis()
    perfis.value = data
  } catch (err: any) {
    console.error('Erro ao carregar perfis:', err)
    error.value = err.message || 'Erro ao carregar usuários'
  } finally {
    loading.value = false
  }
}

// Carregar dados na montagem do componente
onMounted(() => {
  loadPerfis()
})

// Função para lidar com a criação de usuário
const handleUsuarioCriado = () => {
  // Recarregar a lista de usuários
  loadPerfis()
}

// Função para confirmar deleção
const confirmarDeleção = (perfil: AgPerfil) => {
  usuarioParaDeletar.value = perfil
  mostrarModalConfirmacao.value = true
}

// Função para executar a deleção
const executarDeleção = async () => {
  if (!usuarioParaDeletar.value?.user_id) return

  try {
    const { data, error } = await deleteUser(usuarioParaDeletar.value.user_id)
    
    if (error) {
      throw error
    }

    showSuccess(`Usuário ${usuarioParaDeletar.value.nome || usuarioParaDeletar.value.email} foi deletado com sucesso!`)
    
    // Fechar modal e limpar seleção
    mostrarModalConfirmacao.value = false
    usuarioParaDeletar.value = null
    
    // Recarregar lista
    loadPerfis()
    
  } catch (err: any) {
    console.error('Erro ao deletar usuário:', err)
    showError(err.message || 'Erro ao deletar usuário')
  }
}
</script>
