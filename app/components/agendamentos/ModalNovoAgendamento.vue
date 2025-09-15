<template>
  <BaseModal
    v-model="isOpen"
    titulo="Novo Agendamento"
    textoBotaoConfirmar="Salvar"
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

      <!-- Cliente -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Cliente *
        </label>
        <select
          v-model="form.clienteId"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        >
          <option value="">Selecione um cliente</option>
          <!-- TODO: Implementar busca real de clientes -->
          <option value="1">João Silva - 123.456.789-00</option>
          <option value="2">Maria Santos - 987.654.321-11</option>
          <option value="3">Carlos Oliveira - 456.789.123-22</option>
          <option value="4">Ana Costa - 789.123.456-33</option>
        </select>
        <p class="mt-1 text-xs text-gray-500">
          Não encontrou o cliente? <a href="#" class="text-blue-600 hover:text-blue-800">Cadastrar novo cliente</a>
        </p>
      </div>

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

      <!-- Data -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Data *
        </label>
        <select
          v-model="form.data"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
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

      <!-- Horários (só aparecem quando data for selecionada) -->
      <div v-if="form.data" class="grid grid-cols-2 gap-4">
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
              v-for="hora in horariosDisponiveis"
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

      <!-- Mensagem de validação -->
      <div v-if="mensagemValidacao" class="text-red-600 text-sm">
        {{ mensagemValidacao }}
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../BaseModal.vue'
import BaseInput from '../BaseInput.vue'
import type { AgProfissional } from '../../../shared/types/database'

interface Props {
  modelValue: boolean
  profissional: AgProfissional | null
  diasSemana: Date[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'salvar': [dados: any]
}>()

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
  horaFim: ''
})

const loading = ref(false)
const mensagemValidacao = ref('')

// Computed para gerar horários disponíveis (8h às 22h)
const horariosDisponiveis = computed(() => {
  const horarios = []
  for (let hora = 8; hora <= 22; hora++) {
    for (let minuto = 0; minuto < 60; minuto += 30) {
      const horaStr = hora.toString().padStart(2, '0')
      const minutoStr = minuto.toString().padStart(2, '0')
      const value = `${horaStr}:${minutoStr}`
      const label = `${horaStr}:${minutoStr}`
      horarios.push({ value, label })
    }
  }
  return horarios
})

// Computed para horários de fim (só após a hora de início selecionada)
const horariosFimDisponiveis = computed(() => {
  if (!form.value.horaInicio) return []
  
  const partesInicio = form.value.horaInicio.split(':')
  const horaInicio = parseInt(partesInicio[0] || '0', 10)
  const minutoInicio = parseInt(partesInicio[1] || '0', 10)
  const inicioMinutos = horaInicio * 60 + minutoInicio
  
  return horariosDisponiveis.value.filter(horario => {
    const partes = horario.value.split(':')
    const hora = parseInt(partes[0] || '0', 10)
    const minuto = parseInt(partes[1] || '0', 10)
    const totalMinutos = hora * 60 + minuto
    return totalMinutos > inicioMinutos
  })
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

// Handlers
const onDataChange = () => {
  // Resetar horários quando data muda
  form.value.horaInicio = ''
  form.value.horaFim = ''
  mensagemValidacao.value = ''
}

const onHoraInicioChange = () => {
  // Resetar hora fim quando hora início muda
  form.value.horaFim = ''
  mensagemValidacao.value = ''
}

const validarFormulario = (): boolean => {
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
  
  mensagemValidacao.value = ''
  return true
}

const handleConfirmar = () => {
  if (!validarFormulario()) return
  
  // Emitir dados para o componente pai
  const dados = {
    profissional_id: props.profissional?.profissional_id,
    cliente_id: parseInt(form.value.clienteId),
    titulo: form.value.titulo,
    descricao: form.value.descricao || null,
    data: form.value.data,
    hora_inicio: form.value.horaInicio,
    hora_fim: form.value.horaFim
  }
  
  console.log('Dados do agendamento:', dados)
  emit('salvar', dados)
}

// Resetar form quando modal fechar
watch(isOpen, (novoValor) => {
  if (!novoValor) {
    form.value = {
      clienteId: '',
      titulo: '',
      descricao: '',
      data: '',
      horaInicio: '',
      horaFim: ''
    }
    mensagemValidacao.value = ''
  }
})
</script>
