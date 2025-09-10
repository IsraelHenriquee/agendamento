<template>
  <BaseModal
    v-model="localShow"
    :titulo="isEdicao ? 'Editar Cliente' : 'Novo Cliente'"
    :loading="loading"
    :desabilitar-confirmar="!isFormValid"
    :texto-botao-confirmar="isEdicao ? 'Atualizar' : 'Criar'"
    @confirmar="handleConfirmar"
  >
    <form @submit.prevent="handleConfirmar" class="space-y-4">
      <div>
        <label for="nome" class="block text-sm font-medium text-gray-700 mb-1">
          Nome *
        </label>
        <BaseInput
          id="nome"
          v-model="form.nome"
          placeholder="Digite o nome do cliente"
          required
          :disabled="loading"
        />
      </div>

      <div>
        <label for="cpf" class="block text-sm font-medium text-gray-700 mb-1">
          CPF *
        </label>
        <BaseInput
          id="cpf"
          v-model="form.cpf"
          placeholder="Digite o CPF (ex: 123.456.789-00)"
          required
          :disabled="loading"
          :error-message="errors.cpf"
          @input="formatCpf"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <BaseInput
          id="email"
          v-model="form.email"
          type="email"
          placeholder="Digite o email do cliente"
          :disabled="loading"
          :error-message="errors.email"
          @blur="validateEmail"
        />
      </div>

      <div>
        <label for="telefone" class="block text-sm font-medium text-gray-700 mb-1">
          Telefone
        </label>
        <BaseInput
          id="telefone"
          v-model="form.telefone"
          placeholder="Digite o telefone (ex: (11) 99999-9999)"
          :disabled="loading"
          :error-message="errors.telefone"
          @input="formatTelefone"
        />
      </div>

      <div>
        <label for="endereco" class="block text-sm font-medium text-gray-700 mb-1">
          Endereço
        </label>
        <BaseInput
          id="endereco"
          v-model="form.endereco"
          placeholder="Digite o endereço do cliente"
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
  clienteId?: number
  dadosCliente?: any
}

const props = withDefaults(defineProps<Props>(), {
  isEdicao: false,
  clienteId: undefined,
  dadosCliente: null
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
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  endereco: ''
})

// Estado dos erros
const errors = ref({
  cpf: '',
  email: '',
  telefone: ''
})

const loading = ref(false)

// Validação do formulário
const isFormValid = computed(() => {
  const nomeValido = form.value.nome.trim().length > 0
  const cpfValido = form.value.cpf.trim().length > 0 && !errors.value.cpf
  const emailValido = !form.value.email || !errors.value.email
  const telefoneValido = !errors.value.telefone
  
  return nomeValido && cpfValido && emailValido && telefoneValido
})

// Função para limpar apenas números
const apenasNumeros = (value: string) => {
  return value.replace(/\D/g, '')
}

// Função para validar CPF
const validarCpf = (cpf: string) => {
  const numerosCpf = apenasNumeros(cpf)
  
  if (numerosCpf.length === 0) return true // Vazio é válido para limpar erro
  if (numerosCpf.length !== 11) return false
  
  // Verifica se não são todos números iguais
  if (/^(\d)\1{10}$/.test(numerosCpf)) return false
  
  // Validação do dígito verificador
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numerosCpf.charAt(i)) * (10 - i)
  }
  let resto = 11 - (soma % 11)
  let digito1 = resto >= 10 ? 0 : resto
  
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numerosCpf.charAt(i)) * (11 - i)
  }
  resto = 11 - (soma % 11)
  let digito2 = resto >= 10 ? 0 : resto
  
  return parseInt(numerosCpf.charAt(9)) === digito1 && parseInt(numerosCpf.charAt(10)) === digito2
}

// Função para formatar CPF
const formatCpf = () => {
  const numeros = apenasNumeros(form.value.cpf)
  
  if (numeros.length <= 11) {
    let cpfFormatado = numeros
    if (numeros.length > 3) {
      cpfFormatado = numeros.substring(0, 3) + '.' + numeros.substring(3)
    }
    if (numeros.length > 6) {
      cpfFormatado = cpfFormatado.substring(0, 7) + '.' + cpfFormatado.substring(7)
    }
    if (numeros.length > 9) {
      cpfFormatado = cpfFormatado.substring(0, 11) + '-' + cpfFormatado.substring(11)
    }
    
    form.value.cpf = cpfFormatado
    
    // Validar CPF
    if (numeros.length === 11) {
      if (!validarCpf(numeros)) {
        errors.value.cpf = 'CPF inválido'
      } else {
        errors.value.cpf = ''
      }
    } else if (numeros.length > 0) {
      errors.value.cpf = 'CPF deve ter 11 dígitos'
    } else {
      errors.value.cpf = ''
    }
  }
}

// Função para validar email
const validateEmail = () => {
  if (!form.value.email) {
    errors.value.email = ''
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Email inválido'
  } else {
    errors.value.email = ''
  }
}

// Função para formatar telefone
const formatTelefone = () => {
  const numeros = apenasNumeros(form.value.telefone)
  
  if (numeros.length <= 11) {
    let telefoneFormatado = numeros
    
    if (numeros.length > 0) {
      telefoneFormatado = '(' + numeros.substring(0, 2)
    }
    if (numeros.length > 2) {
      telefoneFormatado = telefoneFormatado + ') ' + numeros.substring(2)
    }
    if (numeros.length > 7) {
      telefoneFormatado = telefoneFormatado.substring(0, 10) + '-' + telefoneFormatado.substring(10)
    }
    
    form.value.telefone = telefoneFormatado
    
    // Validar telefone
    if (numeros.length > 0 && numeros.length < 10) {
      errors.value.telefone = 'Telefone deve ter pelo menos 10 dígitos'
    } else if (numeros.length > 11) {
      errors.value.telefone = 'Telefone deve ter no máximo 11 dígitos'
    } else {
      errors.value.telefone = ''
    }
  }
}

// Limpar formulário
const limparForm = () => {
  form.value = {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: ''
  }
  errors.value = {
    cpf: '',
    email: '',
    telefone: ''
  }
}

// Carregar dados para edição
const carregarCliente = async () => {
  if (!props.isEdicao || !props.clienteId) return

  // Se já temos os dados pré-carregados, usar eles
  if (props.dadosCliente) {
    form.value = {
      nome: props.dadosCliente.nome || '',
      cpf: props.dadosCliente.cpf || '',
      email: props.dadosCliente.email || '',
      telefone: props.dadosCliente.telefone || '',
      endereco: props.dadosCliente.endereco || ''
    }
    // Limpar erros ao carregar dados
    errors.value = {
      cpf: '',
      email: '',
      telefone: ''
    }
    return
  }

  // TODO: Implementar fetchClienteById quando necessário
  // try {
  //   loading.value = true
  //   const { fetchClienteById } = useProfissionais()
  //   const data = await fetchClienteById(props.clienteId)
  //   if (data) {
  //     form.value = {
  //       nome: data.nome || '',
  //       cpf: data.cpf || '',
  //       email: data.email || '',
  //       telefone: data.telefone || '',
  //       endereco: data.endereco || ''
  //     }
  //   }
  // } catch (error) {
  //   console.error('Erro ao carregar cliente:', error)
  //   const { showError } = useNotification()
  //   showError('Erro ao carregar dados do cliente')
  // } finally {
  //   loading.value = false
  // }
}

// Salvar cliente
const handleConfirmar = async () => {
  if (!isFormValid.value) return

  try {
    loading.value = true
    
    if (props.isEdicao && props.clienteId) {
      // Atualizar cliente existente
      const { updateCliente } = useProfissionais()
      
      // Remover máscaras antes de salvar
      const cpfLimpo = apenasNumeros(form.value.cpf)
      const telefoneLimpo = form.value.telefone ? apenasNumeros(form.value.telefone) : undefined
      
      const result = await updateCliente(
        props.clienteId,
        form.value.nome.trim(),
        cpfLimpo,
        form.value.endereco.trim() || undefined,
        form.value.email.trim() || undefined,
        telefoneLimpo
      )
      
      const { showSuccess } = useNotification()
      
      if (result.success) {
        showSuccess(result.message || 'Cliente atualizado com sucesso!')
        emit('sucesso')
      } else {
        const { showError } = useNotification()
        showError('Erro ao atualizar cliente')
        return // Não fechar o modal em caso de erro
      }
    } else {
      // Criar novo cliente
      const { addCliente } = useProfissionais()
      
      // Remover máscaras antes de salvar
      const cpfLimpo = apenasNumeros(form.value.cpf)
      const telefoneLimpo = form.value.telefone ? apenasNumeros(form.value.telefone) : undefined
      
      const result = await addCliente(
        form.value.nome.trim(),
        cpfLimpo,
        form.value.endereco.trim() || undefined,
        form.value.email.trim() || undefined,
        telefoneLimpo
      )
      
      const { showSuccess } = useNotification()
      
      if (result.success) {
        showSuccess(result.message || 'Cliente criado com sucesso!')
        emit('sucesso')
      } else {
        const { showError } = useNotification()
        showError('Erro ao criar cliente')
        return // Não fechar o modal em caso de erro
      }
    }

    // Fechar modal e limpar formulário
    localShow.value = false
    limparForm()
  } catch (error: any) {
    console.error('Erro ao salvar cliente:', error)
    const { showError } = useNotification()
    
    // Verificar se é erro de CPF duplicado
    if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
      showError('Erro: Já existe um cliente cadastrado com este CPF')
    } else {
      showError(props.isEdicao ? 'Erro ao atualizar cliente' : 'Erro ao criar cliente')
    }
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    if (props.isEdicao && props.clienteId) {
      carregarCliente()
    } else {
      limparForm()
    }
  }
})

watch(() => props.clienteId, () => {
  if (props.modelValue && props.isEdicao && props.clienteId) {
    carregarCliente()
  }
})

// Watcher para dados pré-carregados
watch(() => props.dadosCliente, (newData) => {
  if (newData && props.isEdicao) {
    form.value = {
      nome: newData.nome || '',
      cpf: newData.cpf || '',
      email: newData.email || '',
      telefone: newData.telefone || '',
      endereco: newData.endereco || ''
    }
    // Limpar erros ao carregar dados
    errors.value = {
      cpf: '',
      email: '',
      telefone: ''
    }
  }
}, { immediate: true })
</script>
