<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="flex flex-col">
      <!-- Primeira linha - Controles principais -->
      <div class="flex-1 flex items-center px-6 py-4">
        <!-- Lado esquerdo - Controlador de Semana -->
        <div class="flex-1 flex justify-start">
          <ControladorSemana />
        </div>
        
        <!-- Centro - Profissional Atual -->
        <div class="flex-1 flex justify-center">
          <ProfissionalAtual ref="profissionalAtualRef" />
        </div>
        
        <!-- Lado direito - Botão Novo -->
        <div class="flex-1 flex justify-end">
          <BaseButton
            variant="primary"
            size="md"
            @click="handleNovoAgendamento"
          >
            Novo
          </BaseButton>
        </div>
      </div>
      
      <!-- Segunda linha - Lista de Dias -->
      <div class="px-6 pb-2">
        <ListaDias :diasSemana="agendamentoStore.diasSemana" />
      </div>
    </div>

    <!-- Corpo - Ocupa todo o restante do espaço -->
    <div class="flex-1 flex">
      <!-- Lado esquerdo - Régua de Horários -->
      <ReguaHorarios />
      
      <!-- Grid de dias - Lista os 7 dias da semana -->
      <div class="flex flex-1 px-6 gap-2">
        <ItemAgendamento
          v-for="(dia, index) in agendamentoStore.diasSemana"
          :key="index"
          :data="dia"
          :agendamentos="agendamentos"
        />
      </div>
    </div>

    <!-- Modal de Novo Agendamento -->
    <ModalNovoAgendamento
      v-model="mostrarModalNovo"
      :profissional="profissionalAtualRef?.profissionalAtual || null"
      :diasSemana="agendamentoStore.diasSemana"
      @salvar="handleSalvarAgendamento"
    />
  </div>
</template>

<script setup lang="ts">
// Imports explícitos
import ControladorSemana from './ControladorSemana.vue'
import ProfissionalAtual from './ProfissionalAtual.vue'
import ListaDias from './ListaDias.vue'
import ReguaHorarios from './ReguaHorarios.vue'
import ItemAgendamento from './ItemAgendamento.vue'
import ModalNovoAgendamento from './ModalNovoAgendamento.vue'
import BaseButton from '../BaseButton.vue'
import { useAgendamento } from '../../composables/useAgendamento'

// Store de agendamento
const agendamentoStore = useAgendamentoStore()

// Composable de agendamentos
const { agendamentos, loading, error, fetchAgendamentosByProfissional, limparCache } = useAgendamento()

// Ref para o componente ProfissionalAtual
const profissionalAtualRef = ref<InstanceType<typeof ProfissionalAtual> | null>(null)

// Props (se necessário no futuro)
interface Props {}
defineProps<Props>()

// Emits (se necessário no futuro)
const emit = defineEmits<{
  // 'evento': [parametro: tipo]
}>()

// Funções de agendamento
const loadAgendamentos = async (profissionalId: number) => {
  await fetchAgendamentosByProfissional(profissionalId)
}

// Estado do modal
const mostrarModalNovo = ref(false)

// Watch para buscar agendamentos quando o profissional mudar
watch(
  () => profissionalAtualRef.value?.profissionalAtual,
  (novoProfissional) => {
    if (novoProfissional?.profissional_id) {
      console.log('Profissional mudou, buscando agendamentos para:', novoProfissional.nome)
      loadAgendamentos(novoProfissional.profissional_id)
    }
  },
  { immediate: false } // Não executar imediatamente, apenas quando mudar
)

// Watch para buscar agendamentos quando a semana mudar
watch(
  () => agendamentoStore.diasSemana,
  () => {
    const profissional = profissionalAtualRef.value?.profissionalAtual
    if (profissional?.profissional_id) {
      console.log('Semana mudou, buscando agendamentos para a nova semana')
      loadAgendamentos(profissional.profissional_id)
    }
  },
  { deep: true } // Watch profundo para detectar mudanças no array
)

// Funções (serão adicionadas conforme necessário)
const handleNovoAgendamento = () => {
  console.log('Novo agendamento clicado')
  mostrarModalNovo.value = true
}

// Função para salvar novo agendamento
const handleSalvarAgendamento = (dados: any) => {
  console.log('Salvando agendamento:', dados)
  // TODO: Implementar salvamento no banco
  mostrarModalNovo.value = false
  
  // Recarregar agendamentos após salvar
  const profissional = profissionalAtualRef.value?.profissionalAtual
  if (profissional?.profissional_id) {
    recarregarAgendamentos()
  }
}

// Função para recarregar dados forçando nova busca (limpa cache)
const recarregarAgendamentos = () => {
  const profissional = profissionalAtualRef.value?.profissionalAtual
  if (profissional?.profissional_id) {
    console.log('Recarregando agendamentos (limpando cache)')
    limparCache()
    loadAgendamentos(profissional.profissional_id)
  }
}

// const createAgendamento = async () => { ... }
// const updateAgendamento = async () => { ... }
// const deleteAgendamento = async () => { ... }

// Lifecycle hooks
onMounted(() => {
  // Inicialização do componente
  console.log('AgendamentoManager montado')
  
  // Aguardar um pouco mais para garantir que o ProfissionalAtual carregou os dados
  setTimeout(() => {
    const profissional = profissionalAtualRef.value?.profissionalAtual
    if (profissional?.profissional_id) {
      console.log('Carregando agendamentos iniciais para:', profissional.nome)
      loadAgendamentos(profissional.profissional_id)
    }
  }, 500) // Aguarda 500ms para o componente carregar
})

// Expor funções para componente pai (se necessário)
defineExpose({
  loadAgendamentos,
  recarregarAgendamentos,
  limparCache,
  loading: readonly(loading),
  error: readonly(error)
})
</script>
