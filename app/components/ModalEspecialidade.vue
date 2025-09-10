<template>
  <BaseModal
    v-model="localShow"
    :titulo="isEdicao ? 'Editar Especialidade' : 'Nova Especialidade'"
    :loading="loading"
    :desabilitar-confirmar="!isFormValid"
    :texto-botao-confirmar="isEdicao ? 'Atualizar' : 'Criar'"
    @confirmar="handleConfirmar"
  >
    <form @submit.prevent="handleConfirmar" class="space-y-4">
      <div>
        <label for="especialidade" class="block text-sm font-medium text-gray-700 mb-1">
          Nome da Especialidade *
        </label>
        <BaseInput
          id="especialidade"
          v-model="form.especialidade"
          placeholder="Digite o nome da especialidade"
          required
          :disabled="loading"
        />
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  isEdicao?: boolean
  especialidadeId?: number
  dadosEspecialidade?: any
}

const props = withDefaults(defineProps<Props>(), {
  isEdicao: false,
  especialidadeId: undefined,
  dadosEspecialidade: null
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
  especialidade: ''
})

const loading = ref(false)

// Validação do formulário
const isFormValid = computed(() => {
  return form.value.especialidade.trim().length > 0
})

// Limpar formulário
const limparForm = () => {
  form.value = {
    especialidade: ''
  }
}

// Carregar dados para edição
const carregarEspecialidade = async () => {
  if (!props.isEdicao || !props.especialidadeId) return

  // Se já temos os dados pré-carregados, usar eles
  if (props.dadosEspecialidade) {
    form.value = {
      especialidade: props.dadosEspecialidade.especialidade || ''
    }
    return
  }

  // Caso contrário, carregar do servidor usando composable (fallback)
  try {
    loading.value = true
    const { fetchEspecialidadeById } = useProfissionais()
    
    const data = await fetchEspecialidadeById(props.especialidadeId)

    if (data) {
      form.value = {
        especialidade: data.especialidade || ''
      }
    }
  } catch (error) {
    console.error('Erro ao carregar especialidade:', error)
    const { showError } = useNotification()
    showError('Erro ao carregar dados da especialidade')
  } finally {
    loading.value = false
  }
}

// Salvar especialidade
const handleConfirmar = async () => {
  if (!isFormValid.value) return

  try {
    loading.value = true
    
    if (props.isEdicao && props.especialidadeId) {
      // Atualizar especialidade existente usando RPC
      const { updateEspecialidade } = useProfissionais()
      
      const result = await updateEspecialidade(props.especialidadeId, form.value.especialidade.trim())
      
      const { showSuccess, showError } = useNotification()
      
      if (result.success) {
        showSuccess(result.message || 'Especialidade atualizada com sucesso!')
        emit('sucesso')
      } else {
        showError(result.message || 'Erro ao atualizar especialidade')
        return // Não fechar o modal em caso de erro
      }
    } else {
      // Criar nova especialidade usando RPC
      const { addEspecialidade } = useProfissionais()
      
      const result = await addEspecialidade(form.value.especialidade.trim())
      
      const { showSuccess, showError } = useNotification()
      
      if (result.success) {
        showSuccess(result.message || 'Especialidade criada com sucesso!')
        emit('sucesso')
      } else {
        showError(result.message || 'Erro ao criar especialidade')
        return // Não fechar o modal em caso de erro
      }
    }

    // Fechar modal e limpar formulário
    localShow.value = false
    limparForm()
  } catch (error: any) {
    console.error('Erro ao salvar especialidade:', error)
    const { showError } = useNotification()
    
    // Verificar se é erro de permissão
    if (error.message && error.message.includes('Permissão negada')) {
      showError('Permissão negada: apenas administradores podem modificar especialidades')
    } else {
      showError(props.isEdicao ? 'Erro ao atualizar especialidade' : 'Erro ao criar especialidade')
    }
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    if (props.isEdicao && props.especialidadeId) {
      carregarEspecialidade()
    } else {
      limparForm()
    }
  }
})

watch(() => props.especialidadeId, () => {
  if (props.modelValue && props.isEdicao && props.especialidadeId) {
    carregarEspecialidade()
  }
})

// Watcher para dados pré-carregados
watch(() => props.dadosEspecialidade, (newData) => {
  if (newData && props.isEdicao) {
    form.value = {
      especialidade: newData.especialidade || ''
    }
  }
}, { immediate: true })
</script>
