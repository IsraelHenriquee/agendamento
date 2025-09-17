<template>
  <BaseModal
    v-model="localShow"
    :titulo="titulo"
    :loading="loading"
    :texto-botao-confirmar="textoBotaoConfirmar"
    :texto-botao-cancelar="textoBotaoCancelar"
    :mostrar-botao-confirmar="true"
    :mostrar-botao-cancelar="mostrarBotaoCancelar"
    @confirmar="handleConfirmar"
  >
    <div class="flex items-center">
      <!-- Ícone de alerta -->
      <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
      </div>
      
      <!-- Conteúdo -->
      <div class="ml-4 text-left">
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-2">
          {{ titulo }}
        </h3>
        <div class="text-sm text-gray-500">
          <p>{{ mensagem }}</p>
          <p v-if="detalhes" class="mt-2 font-medium text-gray-700">{{ detalhes }}</p>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue: boolean
  titulo?: string
  mensagem: string
  detalhes?: string
  textoBotaoConfirmar?: string
  textoBotaoCancelar?: string
  mostrarBotaoCancelar?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  titulo: 'Confirmar ação',
  textoBotaoConfirmar: 'Confirmar',
  textoBotaoCancelar: 'Cancelar',
  mostrarBotaoCancelar: true,
  loading: false,
  detalhes: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirmar': []
}>()

// Estado local do modal
const localShow = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const handleConfirmar = () => {
  emit('confirmar')
}
</script>
