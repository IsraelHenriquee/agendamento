<template>
  <div class="rounded-lg h-full flex flex-col">
    <!-- Header -->
    <div class="flex flex-col bg-white border-b border-neutral-200">
      <!-- Primeira linha - Controles principais -->
      <div class="flex-1 flex items-center px-6 py-4">
        <!-- Lado esquerdo - Controlador de Semana -->
        <div class="flex-1 flex justify-start">
          <ControladorSemana />
        </div>
        
        <!-- Centro - Profissional Atual -->
        <div class="flex-1 flex justify-center">
          <ProfissionalAtual />
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
      <div class="flex flex-1 px-6">
        <ItemAgendamento
          v-for="(dia, index) in agendamentoStore.diasSemana"
          :key="index"
          :data="dia"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Imports explícitos
import ControladorSemana from './ControladorSemana.vue'
import ProfissionalAtual from './ProfissionalAtual.vue'
import ListaDias from './ListaDias.vue'
import ReguaHorarios from './ReguaHorarios.vue'
import ItemAgendamento from './ItemAgendamento.vue'
import BaseButton from '../BaseButton.vue'

// Store de agendamento
const agendamentoStore = useAgendamentoStore()

// Props (se necessário no futuro)
interface Props {}
defineProps<Props>()

// Emits (se necessário no futuro)
const emit = defineEmits<{
  // 'evento': [parametro: tipo]
}>()

// Estado reativo (será expandido conforme necessário)
const loading = ref(false)
const error = ref<string | null>(null)

// Funções (serão adicionadas conforme necessário)
const handleNovoAgendamento = () => {
  console.log('Novo agendamento clicado')
  // TODO: Implementar abertura de modal ou navegação para nova página
}

// const loadAgendamentos = async () => { ... }
// const createAgendamento = async () => { ... }
// const updateAgendamento = async () => { ... }
// const deleteAgendamento = async () => { ... }

// Lifecycle hooks
onMounted(() => {
  // Inicialização do componente
  console.log('AgendamentoManager montado')
})

// Expor funções para componente pai (se necessário)
defineExpose({
  // loadAgendamentos,
  loading: readonly(loading),
  error: readonly(error)
})
</script>
