<template>
  <BaseModal
    v-model="isOpen"
    :titulo="modoEdicao ? 'Editar Agendamento' : 'Novo Agendamento'"
    :textoBotaoConfirmar="modoEdicao ? 'Salvar Alterações' : 'Salvar'"
    :mostrarBotaoCancelar="false"
    :loading="loading"
    @confirmar="handleConfirmar"
  >
    <!-- Conteúdo do modal -->
    <div class="space-y-6">
      <!-- Profissional (apenas exibição) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Profissional
        </label>
        <div class="p-3 bg-gray-50 border border-gray-300 rounded-md">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ profissional?.nome || 'Carregando...' }}</p>
              <p class="text-xs text-gray-500">{{ profissional?.especialidade || '' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Seletor de Cliente -->
      <SeletorCliente
        ref="seletorClienteRef"
        v-model="form.clienteId"
        :clientes="clientes"
        :loading="loadingClientes"
        :disabled="modoEdicao"
        @cadastrar-novo="handleCadastrarNovoCliente"
      />

      <!-- Título -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Título *
        </label>
        <BaseInput
          v-model="form.titulo"
          placeholder="Ex: Consulta de rotina"
          required
        />
      </div>

      <!-- Descrição -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Descrição
        </label>
        <textarea
          v-model="form.descricao"
          rows="3"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
          placeholder="Detalhes do agendamento (opcional)"
        />
      </div>

      <!-- Seletor de Cor -->
      <SeletorCor v-model="form.cor" />

      <!-- Data -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Data *
        </label>
        <select
          v-model="form.data"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
          :disabled="modoEdicao"
          @change="onDataChange"
        >
          <option value="">Selecione uma data</option>
          <option
            v-for="(dia, index) in diasSemana"
            :key="index"
            :value="dia.toISOString().split('T')[0]"
          >
            {{ formatarDiaCompleto(dia) }}
          </option>
        </select>
      </div>

      <!-- Horários - Modo Criação (só aparecem quando data for selecionada) -->
      <div v-if="form.data && !modoEdicao" class="grid grid-cols-2 gap-4">
        <!-- Hora Início -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Hora Início *
          </label>
          <select
            v-model="form.horaInicio"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            @change="onHoraInicioChange"
          >
            <option value="">Selecione</option>
            <option
              v-for="hora in horariosInicioDisponiveis"
              :key="hora.value"
              :value="hora.value"
            >
              {{ hora.label }}
            </option>
          </select>
        </div>

        <!-- Hora Fim -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Hora Fim *
          </label>
          <select
            v-model="form.horaFim"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            :disabled="!form.horaInicio"
          >
            <option value="">Selecione</option>
            <option
              v-for="hora in horariosFimDisponiveis"
              :key="hora.value"
              :value="hora.value"
            >
              {{ hora.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Horários - Modo Edição (apenas exibição) -->
      <div v-if="modoEdicao" class="grid grid-cols-2 gap-4">
        <!-- Hora Início -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Hora Início
          </label>
          <div class="p-3 bg-gray-50 border border-gray-300 rounded-md">
            <p class="text-sm text-gray-900">{{ form.horaInicio || 'Não informado' }}</p>
          </div>
        </div>

        <!-- Hora Fim -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Hora Fim
          </label>
          <div class="p-3 bg-gray-50 border border-gray-300 rounded-md">
            <p class="text-sm text-gray-900">{{ form.horaFim || 'Não informado' }}</p>
          </div>
        </div>
      </div>

      <!-- Mensagem de validação -->
      <div v-if="mensagemValidacao" class="text-red-600 text-sm">
        {{ mensagemValidacao }}
      </div>
    </div>

    <!-- Botão de cancelar agendamento (modo edição) -->
    <template #footer-actions>
      <button
        v-if="modoEdicao"
        type="button"
        class="inline-flex justify-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading"
        @click="handleCancelarAgendamento"
      >
        Cancelar Agendamento
      </button>
    </template>
  </BaseModal>

  <!-- Modal de Confirmação para Cancelamento -->
  <ModalConfirmacao
    v-model="mostrarModalConfirmacao"
    titulo="Cancelar Agendamento"
    :mensagem="`Tem certeza que deseja cancelar o agendamento '${form.titulo}'?`"
    detalhes="Esta ação não pode ser desfeita. O agendamento será marcado como cancelado."
    texto-botao-confirmar="Sim, Cancelar"
    texto-botao-cancelar="Não, Manter"
    :loading="loading"
    @confirmar="confirmarCancelamento"
  />
</template>

<script setup lang="ts">
import BaseModal from '../BaseModal.vue'
import BaseInput from '../BaseInput.vue'
import SeletorCliente from '../SeletorCliente.vue'
import SeletorCor from '../SeletorCor.vue'
import ModalConfirmacao from '../ModalConfirmacao.vue'
import { useValidacaoHorarios } from '../../composables/useValidacaoHorarios'
import { useAgendamento } from '../../composables/useAgendamento'
import { useNotification } from '../../composables/useNotification'
import type { AgProfissional, AgCliente, AgAgendamento } from '../../../shared/types/database'

const { showSuccess, showError } = useNotification()

interface Props {
  modelValue: boolean
  profissional: AgProfissional | null
  diasSemana: Date[]
  clientes: AgCliente[]
  loadingClientes?: boolean
  agendamentos: AgAgendamento[]
  agendamentoParaEditar?: AgAgendamento | null // Novo prop para edição
}

const props = withDefaults(defineProps<Props>(), {
  loadingClientes: false,
  agendamentos: () => [],
  agendamentoParaEditar: null
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'agendamento-salvo': [agendamento: AgAgendamento]
  'agendamento-editado': [agendamento: AgAgendamento]
  'agendamento-cancelado': [agendamento: AgAgendamento]
}>()

// Composables
const { inserirAgendamento, atualizarAgendamento, cancelarAgendamento, loading: loadingAgendamento } = useAgendamento()

// Computed para detectar modo de edição
const modoEdicao = computed(() => !!props.agendamentoParaEditar)

// Refs
const seletorClienteRef = ref<InstanceType<typeof SeletorCliente>>()

// Controle do modal
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Estado do formulário
const form = ref({
  clienteId: '',
  titulo: '',
  descricao: '',
  data: '',
  horaInicio: '',
  horaFim: '',
  cor: '#DBE9FE'
})

const loading = computed(() => loadingAgendamento.value)
const mensagemValidacao = ref('')

// Estado do modal de confirmação
const mostrarModalConfirmacao = ref(false)

// Composable para validação de horários
const agendamentosRef = computed(() => props.agendamentos)
const profissionalRef = computed(() => props.profissional)
const { obterHorariosInicioDisponiveis, obterHorariosFimDisponiveis, validarConflito } = useValidacaoHorarios(agendamentosRef, profissionalRef)

// Computed para horários disponíveis
const horariosInicioDisponiveis = computed(() => {
  return obterHorariosInicioDisponiveis(form.value.data)
})

const horariosFimDisponiveis = computed(() => {
  return obterHorariosFimDisponiveis(form.value.data, form.value.horaInicio)
})

// Função para formatar dia completo
const formatarDiaCompleto = (data: Date) => {
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  
  const diaSemana = diasSemana[data.getDay()]
  const dia = data.getDate().toString().padStart(2, '0')
  const mes = meses[data.getMonth()]
  
  return `${diaSemana}, ${dia} ${mes}`
}

// Função para extrair hora de time with timezone (ex: "11:00:00-03" -> "11:00")
const extrairHora = (timeWithTimezone: string | null): string => {
  console.log('=== EXTRAIR HORA ===')
  console.log('Input:', timeWithTimezone)
  console.log('Tipo:', typeof timeWithTimezone)
  
  if (!timeWithTimezone) {
    console.log('Retornando string vazia - input null/undefined')
    return ''
  }
  
  // Converter para string se não for
  const timeString = String(timeWithTimezone).trim()
  console.log('timeString limpo:', timeString)
  
  // Se já está no formato HH:MM, retornar diretamente
  if (/^\d{2}:\d{2}$/.test(timeString)) {
    console.log('Já está no formato HH:MM:', timeString)
    return timeString
  }
  
  // Extrair HH:MM do formato "HH:MM:SS-TZ" ou "HH:MM:SS+TZ"
  const match = timeString.match(/^(\d{1,2}):(\d{2})/)
  if (match && match[1] && match[2]) {
    const horas = match[1].padStart(2, '0')
    const minutos = match[2]
    const resultado = `${horas}:${minutos}`
    console.log('Extraído por regex:', resultado)
    return resultado
  }
  
  console.log('Não foi possível extrair, retornando string vazia')
  return ''
}

// Computed para nome do cliente selecionado
const nomeClienteSelecionado = computed(() => {
  if (!props.agendamentoParaEditar?.cliente_id) return ''
  const cliente = props.clientes.find(c => c.id === props.agendamentoParaEditar?.cliente_id)
  return cliente?.nome || 'Cliente não encontrado'
})

// Watch para preencher formulário quando for modo edição
watch(() => props.agendamentoParaEditar, (agendamento) => {
  if (agendamento && props.modelValue) {
    console.log('=== DADOS DO AGENDAMENTO PARA EDIÇÃO ===')
    console.log('agendamento.hora_inicio:', agendamento.hora_inicio)
    console.log('agendamento.hora_fim:', agendamento.hora_fim)
    console.log('tipo hora_inicio:', typeof agendamento.hora_inicio)
    console.log('tipo hora_fim:', typeof agendamento.hora_fim)
    
    // Preencher formulário com dados do agendamento
    form.value = {
      clienteId: agendamento.cliente_id?.toString() || '',
      titulo: agendamento.titulo || '',
      descricao: agendamento.descricao || '',
      data: agendamento.data || '',
      horaInicio: extrairHora(agendamento.hora_inicio),
      horaFim: extrairHora(agendamento.hora_fim),
      cor: agendamento.cor || '#DBE9FE'
    }
    
    console.log('=== DEPOIS DE EXTRAIR AS HORAS ===')
    console.log('form.horaInicio:', form.value.horaInicio)
    console.log('form.horaFim:', form.value.horaFim)
    
    // Definir o cliente selecionado no SeletorCliente
    nextTick(() => {
      if (seletorClienteRef.value && agendamento.cliente_id) {
        const cliente = props.clientes.find(c => c.id === agendamento.cliente_id)
        if (cliente) {
          seletorClienteRef.value.definirClienteSelecionado(cliente)
        }
      }
    })
    
    console.log('Dados preenchidos no formulário:', form.value)
  }
}, { immediate: true })

// Handlers
const handleCadastrarNovoCliente = () => {
  emit('update:modelValue', false)
  navigateTo('/clientes')
}

const onDataChange = () => {
  form.value.horaInicio = ''
  form.value.horaFim = ''
  mensagemValidacao.value = ''
}

const onHoraInicioChange = () => {
  form.value.horaFim = ''
  mensagemValidacao.value = ''
}

const validarFormulario = (): boolean => {
  // No modo edição, apenas validar título
  if (modoEdicao.value) {
    if (!form.value.titulo.trim()) {
      mensagemValidacao.value = 'Digite um título'
      return false
    }
    mensagemValidacao.value = ''
    return true
  }
  
  // Validação completa no modo criação
  if (!form.value.clienteId) {
    mensagemValidacao.value = 'Selecione um cliente'
    return false
  }
  
  if (!form.value.titulo.trim()) {
    mensagemValidacao.value = 'Digite um título'
    return false
  }
  
  if (!form.value.data) {
    mensagemValidacao.value = 'Selecione uma data'
    return false
  }
  
  if (!form.value.horaInicio) {
    mensagemValidacao.value = 'Selecione a hora de início'
    return false
  }
  
  if (!form.value.horaFim) {
    mensagemValidacao.value = 'Selecione a hora de fim'
    return false
  }
  
  // Validar conflitos usando composable
  const erroConflito = validarConflito(form.value.data, form.value.horaInicio, form.value.horaFim)
  if (erroConflito) {
    mensagemValidacao.value = erroConflito
    return false
  }
  
  mensagemValidacao.value = ''
  return true
}

const handleConfirmar = async () => {
  if (!validarFormulario()) return
  
  try {
    if (modoEdicao.value && props.agendamentoParaEditar) {
      // Modo edição - apenas título, descrição e cor
      const dadosAtualizacao = {
        titulo: form.value.titulo,
        descricao: form.value.descricao || null,
        cor: form.value.cor
      }
      
      console.log('Editando agendamento:', props.agendamentoParaEditar.id, dadosAtualizacao)
      
      const agendamentoAtualizado = await atualizarAgendamento(props.agendamentoParaEditar.id, dadosAtualizacao)
      
      if (agendamentoAtualizado) {
        showSuccess('Agendamento editado com sucesso!')
        emit('agendamento-editado', agendamentoAtualizado)
        emit('update:modelValue', false)
      }
    } else {
      // Modo criação - todos os campos
      const converterParaTimeWithTimezone = (hora: string): string => {
        return `${hora}:00-03:00`
      }
      
      const dados = {
        profissional_id: props.profissional?.profissional_id!,
        cliente_id: parseInt(form.value.clienteId),
        titulo: form.value.titulo,
        descricao: form.value.descricao || null,
        data: form.value.data,
        hora_inicio: converterParaTimeWithTimezone(form.value.horaInicio),
        hora_fim: converterParaTimeWithTimezone(form.value.horaFim),
        cor: form.value.cor
      }
      
      console.log('Salvando agendamento:', dados)
      
      const novoAgendamento = await inserirAgendamento(dados)
      
      if (novoAgendamento) {
        showSuccess('Agendamento criado com sucesso!')
        emit('agendamento-salvo', novoAgendamento)
        emit('update:modelValue', false)
      }
    }
  } catch (error: any) {
    console.error('Erro ao salvar/editar agendamento:', error)
    showError(error.message || 'Erro ao processar agendamento')
  }
}

// Função para abrir modal de confirmação do cancelamento
const handleCancelarAgendamento = () => {
  mostrarModalConfirmacao.value = true
}

// Função para confirmar cancelamento do agendamento
const confirmarCancelamento = async () => {
  if (!props.agendamentoParaEditar) return
  
  try {
    console.log('Cancelando agendamento:', props.agendamentoParaEditar.id)
    
    const agendamentoCancelado = await cancelarAgendamento(props.agendamentoParaEditar.id)
    
    if (agendamentoCancelado) {
      showSuccess('Agendamento cancelado com sucesso!')
      emit('agendamento-cancelado', agendamentoCancelado)
      emit('update:modelValue', false)
    }
  } catch (error: any) {
    console.error('Erro ao cancelar agendamento:', error)
    showError(error.message || 'Erro ao cancelar agendamento')
  } finally {
    mostrarModalConfirmacao.value = false
  }
}

// Reset form quando modal fechar
watch(isOpen, (novoValor) => {
  if (!novoValor) {
    form.value = {
      clienteId: '',
      titulo: '',
      descricao: '',
      data: '',
      horaInicio: '',
      horaFim: '',
      cor: '#DBE9FE'
    }
    mensagemValidacao.value = ''
    mostrarModalConfirmacao.value = false
    seletorClienteRef.value?.reset()
  }
})
</script>
