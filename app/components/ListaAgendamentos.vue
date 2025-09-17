<template>
  <div class="w-full">
    <!-- Filtros -->
    <div class="bg-white rounded-lg border border-neutral-200 mb-6">
      <div class="px-6 py-4 border-b border-neutral-200">
        <h3 class="text-lg font-medium text-neutral-900">Filtros</h3>
      </div>
      <div class="px-6 py-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Filtro de Cliente -->
          <SeletorCliente
            v-model="clienteIdFiltro"
            :clientes="clientes"
            :loading="loadingClientes"
            @cadastrarNovo="() => {}"
          />
          
          <!-- Filtro de Profissional -->
          <SeletorProfissional
            v-model="profissionalIdFiltro"
            :profissionais="profissionais"
            :loading="loadingProfissionais"
          />
        </div>
        
        <!-- Botão para limpar filtros -->
        <div class="mt-4 flex justify-end">
          <BaseButton
            variant="secondary"
            size="sm"
            @click="limparFiltros"
          >
            Limpar Filtros
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Resultados -->
    <div class="bg-white rounded-lg border border-neutral-200">
      <!-- Header dos resultados -->
      <div class="px-6 py-4 border-b border-neutral-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-neutral-900">
            Agendamentos
            <span v-if="agendamentosFiltrados.length > 0" class="text-sm font-normal text-neutral-500">
              ({{ agendamentosFiltrados.length }} {{ agendamentosFiltrados.length === 1 ? 'agendamento' : 'agendamentos' }})
            </span>
          </h3>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="p-6">
        <div class="space-y-4">
          <div 
            v-for="i in 5" 
            :key="i"
            class="animate-pulse bg-neutral-100 rounded-lg p-4 h-20"
          ></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="p-6 text-center">
        <div class="text-red-500 mb-4">
          <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-lg font-medium">Erro ao carregar agendamentos</p>
          <p class="text-sm text-neutral-600 mt-1">{{ error }}</p>
        </div>
        <BaseButton
          variant="primary"
          @click="buscarAgendamentos"
        >
          Tentar Novamente
        </BaseButton>
      </div>

      <!-- Sem resultados -->
      <div v-else-if="agendamentosFiltrados.length === 0" class="p-6 text-center">
        <div class="text-neutral-400 mb-4">
          <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 012 0v4m0 0V9a2 2 0 104 0V7m-4 0a2 2 0 104 0m-4 0H3m0 0v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18" />
          </svg>
          <p class="text-lg font-medium text-neutral-500">
            {{ temFiltrosAtivos ? 'Nenhum agendamento encontrado com os filtros aplicados' : 'Nenhum agendamento encontrado' }}
          </p>
          <p class="text-sm text-neutral-400 mt-1">
            {{ temFiltrosAtivos ? 'Tente alterar os filtros para ver mais resultados.' : 'Não há agendamentos cadastrados no sistema.' }}
          </p>
        </div>
      </div>

      <!-- Lista de Cards Horizontais -->
      <div v-else class="divide-y divide-neutral-100">
        <CardAgendamento
          v-for="agendamento in agendamentosFiltrados"
          :key="agendamento.id"
          :agendamento="agendamento"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import CardAgendamento from './CardAgendamento.vue'
import SeletorCliente from './SeletorCliente.vue'
import SeletorProfissional from './SeletorProfissional.vue'
import type { AgViewAgendamentosCompleto, AgCliente, AgProfissional } from '../../shared/types/database'
import { useAgendamento } from '../composables/useAgendamento'
import { useProfissionais } from '../composables/useProfissionais'

// Composables
const { fetchRelatorioAgendamentos, loading, error } = useAgendamento()
const { fetchClientes, fetchProfissionais } = useProfissionais()

// Estado reativo
const agendamentos = ref<AgViewAgendamentosCompleto[]>([])
const clientes = ref<AgCliente[]>([])
const profissionais = ref<AgProfissional[]>([])
const loadingClientes = ref(false)
const loadingProfissionais = ref(false)

// Filtros
const clienteIdFiltro = ref('')
const profissionalIdFiltro = ref('')

// Computed para agendamentos filtrados
const agendamentosFiltrados = computed(() => {
  let resultado = agendamentos.value

  // Filtro por cliente
  if (clienteIdFiltro.value) {
    const clienteId = parseInt(clienteIdFiltro.value)
    resultado = resultado.filter(agendamento => agendamento.cliente_id === clienteId)
  }

  // Filtro por profissional
  if (profissionalIdFiltro.value) {
    const profissionalId = parseInt(profissionalIdFiltro.value)
    resultado = resultado.filter(agendamento => agendamento.profissional_id === profissionalId)
  }

  return resultado
})

// Computed para verificar se há filtros ativos
const temFiltrosAtivos = computed(() => {
  return !!(clienteIdFiltro.value || profissionalIdFiltro.value)
})

// Função para buscar todos os agendamentos (incluindo cancelados)
const buscarAgendamentos = async () => {
  try {
    // Buscar todos sem filtros - incluindo cancelados
    const dados = await fetchRelatorioAgendamentos()
    agendamentos.value = dados
  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err)
  }
}

// Função para buscar clientes em segundo plano
const buscarClientes = async () => {
  try {
    loadingClientes.value = true
    const dados = await fetchClientes()
    clientes.value = dados
  } catch (err) {
    console.error('Erro ao buscar clientes:', err)
  } finally {
    loadingClientes.value = false
  }
}

// Função para buscar profissionais em segundo plano
const buscarProfissionais = async () => {
  try {
    loadingProfissionais.value = true
    const dados = await fetchProfissionais()
    profissionais.value = dados
  } catch (err) {
    console.error('Erro ao buscar profissionais:', err)
  } finally {
    loadingProfissionais.value = false
  }
}

// Função para limpar filtros
const limparFiltros = () => {
  clienteIdFiltro.value = ''
  profissionalIdFiltro.value = ''
}

// Lifecycle hooks
onMounted(async () => {
  console.log('ListaAgendamentos montado')
  
  // Buscar todos os agendamentos
  await buscarAgendamentos()
  
  // Buscar clientes e profissionais em segundo plano
  buscarClientes()
  buscarProfissionais()
})
</script>
