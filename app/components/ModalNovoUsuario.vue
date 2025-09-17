<template>
  <BaseModal
    v-model="isOpen"
    titulo="Novo Usuário"
    :loading="loading"
    :desabilitarConfirmar="!isFormValid"
    textoBotaoConfirmar="Criar Usuário"
    textoBotaoCancelar="Cancelar"
    @confirmar="handleSubmit"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Nome -->
      <BaseInput
        v-model="form.nome"
        label="Nome Completo"
        placeholder="Digite o nome completo"
        required
        :errorMessage="errors.nome"
        @blur="validateField('nome')"
      />

      <!-- Email -->
      <BaseInput
        v-model="form.email"
        type="email"
        label="E-mail"
        placeholder="Digite o e-mail"
        required
        :errorMessage="errors.email"
        @blur="validateField('email')"
      />

      <!-- Senha -->
      <BaseInput
        v-model="form.senha"
        type="password"
        label="Senha"
        placeholder="Digite a senha"
        required
        :errorMessage="errors.senha"
        @blur="validateField('senha')"
      />

      <!-- Confirmar Senha -->
      <BaseInput
        v-model="form.confirmarSenha"
        type="password"
        label="Confirmar Senha"
        placeholder="Confirme a senha"
        required
        :errorMessage="errors.confirmarSenha"
        @blur="validateField('confirmarSenha')"
      />

      <!-- Role -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Usuário
          <span class="text-red-500 ml-1">*</span>
        </label>
        <select
          v-model="form.role"
          class="block w-full px-4 py-2 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          :class="{ 'border-red-300': errors.role }"
          @blur="validateField('role')"
        >
          <option value="">Selecione o tipo de usuário</option>
          <option value="admin">Administrador</option>
          <option value="user">Usuário</option>
        </select>
        <p v-if="errors.role" class="mt-1 text-sm text-red-600">
          {{ errors.role }}
        </p>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
}

interface NovoUsuario {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
  role: 'admin' | 'user' | ''
}

interface FormErrors {
  nome?: string
  email?: string
  senha?: string
  confirmarSenha?: string
  role?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'usuario-criado': []
}>()

// Composables
const { showSuccess, showError } = useNotification()
const { createUser, isLoading } = useAuth()

// Estado
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const loading = ref(false)

const form = ref<NovoUsuario>({
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  role: ''
})

const errors = ref<FormErrors>({})

// Validações
const validateField = (field: keyof NovoUsuario) => {
  errors.value[field] = undefined

  switch (field) {
    case 'nome':
      if (!form.value.nome.trim()) {
        errors.value.nome = 'Nome é obrigatório'
      } else if (form.value.nome.trim().length < 2) {
        errors.value.nome = 'Nome deve ter pelo menos 2 caracteres'
      }
      break

    case 'email':
      if (!form.value.email.trim()) {
        errors.value.email = 'E-mail é obrigatório'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = 'E-mail deve ter um formato válido'
      }
      break

    case 'senha':
      if (!form.value.senha) {
        errors.value.senha = 'Senha é obrigatória'
      } else if (form.value.senha.length < 6) {
        errors.value.senha = 'Senha deve ter pelo menos 6 caracteres'
      }
      // Re-validate confirmar senha if it exists
      if (form.value.confirmarSenha) {
        validateField('confirmarSenha')
      }
      break

    case 'confirmarSenha':
      if (!form.value.confirmarSenha) {
        errors.value.confirmarSenha = 'Confirmação de senha é obrigatória'
      } else if (form.value.senha !== form.value.confirmarSenha) {
        errors.value.confirmarSenha = 'Senhas não coincidem'
      }
      break

    case 'role':
      if (!form.value.role) {
        errors.value.role = 'Tipo de usuário é obrigatório'
      }
      break
  }
}

const validateForm = () => {
  const fields: (keyof NovoUsuario)[] = ['nome', 'email', 'senha', 'confirmarSenha', 'role']
  fields.forEach(field => validateField(field))
  return Object.values(errors.value).every(error => !error)
}

const isFormValid = computed(() => {
  return (
    form.value.nome.trim() &&
    form.value.email.trim() &&
    form.value.senha &&
    form.value.confirmarSenha &&
    form.value.role &&
    form.value.senha === form.value.confirmarSenha &&
    Object.values(errors.value).every(error => !error)
  )
})

// Submissão do formulário
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true

    // Criar usuário usando o composable
    const { data, error } = await createUser({
      nome: form.value.nome.trim(),
      email: form.value.email.trim(),
      senha: form.value.senha,
      role: form.value.role as 'admin' | 'user'
    })

    if (error) {
      throw error
    }

    showSuccess(`Usuário ${form.value.nome} criado com sucesso!`)

    // Reset form
    resetForm()

    // Fechar modal e notificar parent
    emit('update:modelValue', false)
    emit('usuario-criado')

  } catch (error: any) {
    console.error('Erro ao criar usuário:', error)
    showError(error.message || 'Ocorreu um erro ao criar o usuário. Tente novamente.')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    role: ''
  }
  errors.value = {}
}

// Reset form when modal closes
watch(isOpen, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})
</script>