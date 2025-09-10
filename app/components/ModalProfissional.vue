<template>
  <BaseModal
    v-model="localShow"
    :titulo="isEdicao ? 'Editar Profissional' : 'Novo Profissional'"
    :loading="loading"
    :desabilitar-confirmar="!isFormValid"
    :texto-botao-confirmar="isEdicao ? 'Atualizar' : 'Criar'"
    @confirmar="handleConfirmar"
  >
    <form @submit.prevent="handleConfirmar" class="space-y-4">
      <div>
        <label for="perfil" class="block text-sm font-medium text-gray-700 mb-1">
          Usuário *
        </label>
        <select
          id="perfil"
          v-model="form.profileId"
          required
          :disabled="loading"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Selecione um usuário</option>
          <option 
            v-for="perfil in perfis" 
            :key="perfil.id" 
            :value="perfil.id"
          >
            {{ perfil.nome }}
          </option>
        </select>
      </div>

      <div>
        <label for="especialidade" class="block text-sm font-medium text-gray-700 mb-1">
          Especialidade *
        </label>
        <select
          id="especialidade"
          v-model="form.especialidadeId"
          required
          :disabled="loading"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Selecione uma especialidade</option>
          <option 
            v-for="especialidade in especialidades" 
            :key="especialidade.id" 
            :value="especialidade.id"
          >
            {{ especialidade.especialidade }}
          </option>
        </select>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import type { AgPerfil, AgEspecialidade } from '../../shared/types/database'

interface Props {
  modelValue: boolean
  isEdicao?: boolean
  profissionalId?: number
  dadosProfissional?: any
  perfis: AgPerfil[]
  especialidades: AgEspecialidade[]
}

const props = withDefaults(defineProps<Props>(), {
  isEdicao: false,
  profissionalId: undefined,
  dadosProfissional: null
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'sucesso': []
}>()

// Estado local do modal
const localShow = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

// Estado do formulário
const form = ref({
  profileId: '',
  especialidadeId: ''
})

const loading = ref(false)

// Validação do formulário
const isFormValid = computed(() => {
  return form.value.profileId !== '' && form.value.especialidadeId !== ''
})

// Limpar formulário
const limparForm = () => {
  form.value = {
    profileId: '',
    especialidadeId: ''
  }
}

// Carregar dados para edição
const carregarProfissional = async () => {
  if (!props.isEdicao || !props.profissionalId) return

  // Se já temos os dados pré-carregados, usar eles
  if (props.dadosProfissional) {
    form.value = {
      profileId: props.dadosProfissional.profile_id?.toString() || '',
      especialidadeId: props.dadosProfissional.especialidade_id?.toString() || ''
    }
    return
  }

  // TODO: Implementar busca de profissional por ID quando necessário
  console.log('Carregar dados do profissional:', props.profissionalId)
}

// Salvar profissional
const handleConfirmar = async () => {
  if (!isFormValid.value) return

  try {
    loading.value = true
    
    if (props.isEdicao && props.profissionalId) {
      // Atualizar profissional existente
      const { updateProfissional } = useProfissionais()
      
      const result = await updateProfissional(
        props.profissionalId,
        parseInt(form.value.profileId),
        parseInt(form.value.especialidadeId)
      )
      
      const { showSuccess, showError } = useNotification()
      
      if (result.success) {
        showSuccess(result.message || 'Profissional atualizado com sucesso!')
      } else {
        showError('Erro ao atualizar profissional')
        return // Não fechar o modal em caso de erro
      }
    } else {
      // Criar novo profissional
      const { addProfissional } = useProfissionais()
      
      const result = await addProfissional(
        parseInt(form.value.profileId),
        parseInt(form.value.especialidadeId)
      )
      
      const { showSuccess, showError } = useNotification()
      
      if (result.success) {
        showSuccess(result.message || 'Profissional criado com sucesso!')
      } else {
        showError('Erro ao criar profissional')
        return // Não fechar o modal em caso de erro
      }
    }
    
    emit('sucesso')
    localShow.value = false
    limparForm()
  } catch (error: any) {
    console.error('Erro ao salvar profissional:', error)
    const { showError } = useNotification()
    
    // Verificar se é erro de permissão ou duplicação
    if (error.message && error.message.includes('duplicate')) {
      showError('Este usuário já está cadastrado como profissional nesta especialidade')
    } else if (error.message && error.message.includes('permission')) {
      showError('Permissão negada: apenas administradores podem criar profissionais')
    } else {
      showError(props.isEdicao ? 'Erro ao atualizar profissional' : 'Erro ao criar profissional')
    }
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    if (props.isEdicao && props.profissionalId) {
      carregarProfissional()
    } else {
      limparForm()
    }
  }
})

watch(() => props.profissionalId, () => {
  if (props.modelValue && props.isEdicao && props.profissionalId) {
    carregarProfissional()
  }
})

// Watcher para dados pré-carregados
watch(() => props.dadosProfissional, (newData) => {
  if (newData && props.isEdicao) {
    form.value = {
      profileId: newData.profile_id?.toString() || '',
      especialidadeId: newData.especialidade_id?.toString() || ''
    }
  }
}, { immediate: true })

// Watcher adicional para garantir que os dados sejam carregados quando o modal abrir
watch(() => props.modelValue, (newValue) => {
  if (newValue && props.isEdicao && props.dadosProfissional) {
    form.value = {
      profileId: props.dadosProfissional.profile_id?.toString() || '',
      especialidadeId: props.dadosProfissional.especialidade_id?.toString() || ''
    }
  }
})
</script>
