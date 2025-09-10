<template>
  <NuxtLayout>
    <!-- Header -->
    <div class="px-6 py-4">
      <h1 class="text-2xl font-bold text-neutral-900">Profissionais</h1>
    </div>

    <!-- Conteúdo -->
    <div class="p-6">
      <TabelaProfissionais 
        ref="tabelaRef" 
        @adicionar="abrirModalAdicionar"
        @editar="abrirModalEditar"
        @deletar="abrirModalDeletar"
      />
    </div>

    <!-- Modal para adicionar/editar profissional -->
    <ModalProfissional 
      v-model="showModal"
      :is-edicao="isEdicao"
      :profissional-id="profissionalId"
      :dados-profissional="dadosProfissional"
      :perfis="perfis"
      :especialidades="especialidades"
      @sucesso="handleSucessoModal"
    />

    <!-- Modal de confirmação para deletar -->
    <ModalConfirmacao 
      v-model="showModalDeletar"
      titulo="Deletar Profissional"
      :mensagem="`Tem certeza que deseja deletar o profissional '${profissionalParaDeletar?.nome}'?`"
      detalhes="Esta ação não pode ser desfeita."
      texto-botao-confirmar="Deletar"
      texto-botao-cancelar="Cancelar"
      :loading="loadingDeletar"
      @confirmar="confirmarDeletar"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { AgPerfil, AgEspecialidade } from '../../shared/types/database'

// Configuração da página
useHead({
  title: 'Profissionais - Sistema de Agendamento',
  meta: [
    { name: 'description', content: 'Gerenciamento de profissionais do sistema de agendamento' }
  ]
})

// Composables
const { fetchPerfis, fetchEspecialidades, deleteProfissional } = useProfissionais()
const { showError, showSuccess } = useNotification()

// Estado do componente
const tabelaRef = ref()

// Estado dos dados para os dropdowns
const perfis = ref<AgPerfil[]>([])
const especialidades = ref<AgEspecialidade[]>([])
const loadingDados = ref(false)

// Estado do modal
const showModal = ref(false)
const isEdicao = ref(false)
const profissionalId = ref<number>()
const dadosProfissional = ref<any>(null)

// Estado do modal de deletar
const showModalDeletar = ref(false)
const profissionalParaDeletar = ref<any>(null)
const loadingDeletar = ref(false)

// Buscar dados iniciais
const carregarDadosIniciais = async () => {
  try {
    loadingDados.value = true
    
    // Buscar perfis e especialidades em paralelo
    const [perfisData, especialidadesData] = await Promise.all([
      fetchPerfis(),
      fetchEspecialidades()
    ])
    
    perfis.value = perfisData
    especialidades.value = especialidadesData
  } catch (error) {
    console.error('Erro ao carregar dados iniciais:', error)
    showError('Erro ao carregar dados necessários para o formulário')
  } finally {
    loadingDados.value = false
  }
}

// Funções para controlar os modais
const abrirModalAdicionar = () => {
  isEdicao.value = false
  profissionalId.value = undefined
  dadosProfissional.value = null
  showModal.value = true
}

const abrirModalEditar = async (id: number) => {
  isEdicao.value = true
  profissionalId.value = id
  
  // Buscar os dados do profissional na tabela
  if (tabelaRef.value && tabelaRef.value.profissionais) {
    const profissional = tabelaRef.value.profissionais.find((p: any) => p.profissional_id === id)
    if (profissional) {
      dadosProfissional.value = profissional
    }
  }
  
  showModal.value = true
}

const abrirModalDeletar = async (id: number) => {
  // Buscar os dados do profissional na tabela
  if (tabelaRef.value && tabelaRef.value.profissionais) {
    const profissional = tabelaRef.value.profissionais.find((p: any) => p.profissional_id === id)
    if (profissional) {
      profissionalParaDeletar.value = profissional
      showModalDeletar.value = true
    }
  }
}

// Função para confirmar deleção
const confirmarDeletar = async () => {
  if (!profissionalParaDeletar.value) return

  try {
    loadingDeletar.value = true
    
    await deleteProfissional(profissionalParaDeletar.value.profissional_id)
    
    showSuccess('Profissional deletado com sucesso!')
    
    // Fechar modal e limpar dados
    showModalDeletar.value = false
    profissionalParaDeletar.value = null
    
    // Recarregar tabela
    if (tabelaRef.value && tabelaRef.value.loadProfissionais) {
      tabelaRef.value.loadProfissionais()
    }
  } catch (error) {
    console.error('Erro ao deletar profissional:', error)
    showError('Erro ao deletar profissional')
  } finally {
    loadingDeletar.value = false
  }
}

const handleSucessoModal = () => {
  // Limpar dados quando modal fechar com sucesso
  dadosProfissional.value = null
  
  // Recarregar a tabela após sucesso
  if (tabelaRef.value && tabelaRef.value.loadProfissionais) {
    tabelaRef.value.loadProfissionais()
  }
  console.log('Profissional salvo com sucesso!')
}

// Carregar dados quando o componente for montado
onMounted(() => {
  carregarDadosIniciais()
})
</script>
