<template>
  <NuxtLayout>
    <!-- Header -->
    <div class="px-6 py-4">
      <h1 class="text-2xl font-bold text-neutral-900">Especialidades</h1>
    </div>

    <!-- Conteúdo -->
    <div class="p-6">
      <TabelaEspecialidades 
        ref="tabelaRef" 
        @adicionar="abrirModalAdicionar"
        @editar="abrirModalEditar"
        @deletar="abrirModalDeletar"
      />
    </div>

    <!-- Modal para adicionar/editar especialidade -->
    <ModalEspecialidade 
      v-model="showModal"
      :is-edicao="isEdicao"
      :especialidade-id="especialidadeId"
      :dados-especialidade="dadosEspecialidade"
      @sucesso="handleSucessoModal"
    />

    <!-- Modal de confirmação para deletar -->
    <ModalConfirmacao 
      v-model="showModalDeletar"
      titulo="Deletar Especialidade"
      :mensagem="`Tem certeza que deseja deletar a especialidade '${especialidadeParaDeletar?.especialidade}'?`"
      detalhes="Esta ação não pode ser desfeita."
      texto-botao-confirmar="Deletar"
      texto-botao-cancelar="Cancelar"
      :loading="loadingDeletar"
      @confirmar="confirmarDeletar"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Configuração da página
useHead({
  title: 'Especialidades - Sistema de Agendamento',
  meta: [
    { name: 'description', content: 'Gerenciamento de especialidades do sistema de agendamento' }
  ]
})

// Estado do modal
const showModal = ref(false)
const tabelaRef = ref()
const isEdicao = ref(false)
const especialidadeId = ref<number>()
const dadosEspecialidade = ref<any>(null)

// Estado do modal de deletar
const showModalDeletar = ref(false)
const especialidadeParaDeletar = ref<any>(null)
const loadingDeletar = ref(false)

// Funções para controlar o modal
const abrirModalAdicionar = () => {
  isEdicao.value = false
  especialidadeId.value = undefined
  dadosEspecialidade.value = null
  showModal.value = true
}

const abrirModalEditar = async (id: number) => {
  isEdicao.value = true
  especialidadeId.value = id
  
  // Carregar dados antes de abrir o modal
  await carregarDadosEspecialidade(id)
  
  showModal.value = true
}

// Função para carregar dados da especialidade
const carregarDadosEspecialidade = async (id: number) => {
  try {
    const { fetchEspecialidadeById } = useProfissionais()
    
    const data = await fetchEspecialidadeById(id)
    
    // Armazenar os dados para o modal
    dadosEspecialidade.value = data
  } catch (error) {
    console.error('Erro ao carregar especialidade:', error)
    const { showError } = useNotification()
    showError('Erro ao carregar dados da especialidade')
  }
}

// Função para abrir modal de deletar
const abrirModalDeletar = async (id: number) => {
  try {
    // Carregar dados da especialidade para mostrar no modal
    const { fetchEspecialidadeById } = useProfissionais()
    const data = await fetchEspecialidadeById(id)
    
    especialidadeParaDeletar.value = data
    showModalDeletar.value = true
  } catch (error) {
    console.error('Erro ao carregar especialidade:', error)
    const { showError } = useNotification()
    showError('Erro ao carregar dados da especialidade')
  }
}

// Função para confirmar deleção
const confirmarDeletar = async () => {
  if (!especialidadeParaDeletar.value) return

  try {
    loadingDeletar.value = true
    const { deleteEspecialidade } = useProfissionais()
    
    await deleteEspecialidade(especialidadeParaDeletar.value.id)
    
    const { showSuccess } = useNotification()
    showSuccess('Especialidade deletada com sucesso!')
    
    // Fechar modal e limpar dados
    showModalDeletar.value = false
    especialidadeParaDeletar.value = null
    
    // Recarregar tabela
    if (tabelaRef.value && tabelaRef.value.loadEspecialidades) {
      tabelaRef.value.loadEspecialidades()
    }
  } catch (error) {
    console.error('Erro ao deletar especialidade:', error)
    const { showError } = useNotification()
    showError('Erro ao deletar especialidade')
  } finally {
    loadingDeletar.value = false
  }
}

const handleSucessoModal = () => {
  // Limpar dados quando modal fechar com sucesso
  dadosEspecialidade.value = null
  
  // Recarregar a tabela após sucesso
  if (tabelaRef.value && tabelaRef.value.loadEspecialidades) {
    tabelaRef.value.loadEspecialidades()
  }
  console.log('Especialidade salva com sucesso!')
}
</script>
