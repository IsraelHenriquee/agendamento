<template>
  <NuxtLayout>
    <!-- Header -->
    <div class="px-6 py-4">
      <h1 class="text-2xl font-bold text-neutral-900">Clientes</h1>
    </div>

    <!-- Conteúdo -->
    <div class="p-6">
      <TabelaClientes 
        ref="tabelaRef" 
        @adicionar="abrirModalAdicionar"
        @editar="abrirModalEditar"
        @deletar="abrirModalDeletar"
      />
    </div>

    <!-- Modal para adicionar/editar cliente -->
    <ModalCliente 
      v-model="showModal"
      :is-edicao="isEdicao"
      :cliente-id="clienteId"
      :dados-cliente="dadosCliente"
      @sucesso="handleSucessoModal"
    />
    
    <!-- Modal de confirmação para deletar -->
    <ModalConfirmacao 
      v-model="showModalDeletar"
      titulo="Deletar Cliente"
      :mensagem="`Tem certeza que deseja deletar o cliente '${clienteParaDeletar?.nome}'?`"
      detalhes="Esta ação não pode ser desfeita."
      texto-botao-confirmar="Deletar"
      texto-botao-cancelar="Cancelar"
      :loading="loadingDeletar"
      @confirmar="confirmarDeletar"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { AgCliente } from '../../shared/types/database'

// Configuração da página
useHead({
  title: 'Clientes - Sistema de Agendamento',
  meta: [
    { name: 'description', content: 'Gerenciamento de clientes do sistema de agendamento' }
  ]
})

// Estado do modal
const showModal = ref(false)
const tabelaRef = ref()
const isEdicao = ref(false)
const clienteId = ref<number>()
const dadosCliente = ref<any>(null)

// Estado do modal de deletar
const showModalDeletar = ref(false)
const clienteParaDeletar = ref<any>(null)
const loadingDeletar = ref(false)

// Funções para controlar o modal
const abrirModalAdicionar = () => {
  isEdicao.value = false
  clienteId.value = undefined
  dadosCliente.value = null
  showModal.value = true
}

const abrirModalEditar = async (cliente: AgCliente) => {
  isEdicao.value = true
  clienteId.value = cliente.id
  dadosCliente.value = cliente
  showModal.value = true
}

const abrirModalDeletar = async (id: number) => {
  // Encontrar o cliente na lista da tabela
  const cliente = tabelaRef.value?.clientes?.find((c: AgCliente) => c.id === id)
  
  if (cliente) {
    clienteParaDeletar.value = cliente
    showModalDeletar.value = true
  } else {
    const { showError } = useNotification()
    showError('Cliente não encontrado')
  }
}

const handleSucessoModal = () => {
  // Limpar dados quando modal fechar com sucesso
  dadosCliente.value = null
  
  // Recarregar a tabela após sucesso
  if (tabelaRef.value && tabelaRef.value.loadClientes) {
    tabelaRef.value.loadClientes()
  }
  console.log('Cliente salvo com sucesso!')
}

// Função para confirmar deleção
const confirmarDeletar = async () => {
  if (!clienteParaDeletar.value) return

  try {
    loadingDeletar.value = true
    const { deleteCliente } = useProfissionais()
    
    await deleteCliente(clienteParaDeletar.value.id)
    
    const { showSuccess } = useNotification()
    showSuccess('Cliente deletado com sucesso!')
    
    // Fechar modal e limpar dados
    showModalDeletar.value = false
    clienteParaDeletar.value = null
    
    // Recarregar tabela
    if (tabelaRef.value && tabelaRef.value.loadClientes) {
      tabelaRef.value.loadClientes()
    }
  } catch (error) {
    console.error('Erro ao deletar cliente:', error)
    const { showError } = useNotification()
    showError('Erro ao deletar cliente')
  } finally {
    loadingDeletar.value = false
  }
}

// TODO: Implementar funções de CRUD quando necessário
// const carregarDadosCliente = async (id: number) => { ... }
</script>
