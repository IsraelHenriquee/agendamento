<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        
        <!-- Modal container -->
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <Transition
            enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="modelValue"
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              @click.stop
            >
              <!-- Header -->
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium leading-6 text-gray-900">
                    {{ titulo }}
                  </h3>
                  <button
                    type="button"
                    class="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    @click="$emit('update:modelValue', false)"
                  >
                    <span class="sr-only">Fechar</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div class="px-4 pb-4 sm:px-6">
                <slot />
              </div>

              <!-- Footer -->
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <BaseButton
                  v-if="mostrarBotaoConfirmar"
                  variant="primary"
                  :loading="loading"
                  :disabled="desabilitarConfirmar"
                  class="ml-3"
                  @click="$emit('confirmar')"
                >
                  {{ textoBotaoConfirmar }}
                </BaseButton>
                
                <BaseButton
                  v-if="mostrarBotaoCancelar"
                  variant="secondary"
                  :disabled="loading"
                  @click="$emit('update:modelValue', false)"
                >
                  {{ textoBotaoCancelar }}
                </BaseButton>

                <!-- Slot para botões personalizados -->
                <slot name="footer-actions" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue: boolean
  titulo: string
  loading?: boolean
  mostrarBotaoConfirmar?: boolean
  mostrarBotaoCancelar?: boolean
  textoBotaoConfirmar?: string
  textoBotaoCancelar?: string
  desabilitarConfirmar?: boolean
  fecharAoClicarFora?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  mostrarBotaoConfirmar: true,
  mostrarBotaoCancelar: true,
  textoBotaoConfirmar: 'Confirmar',
  textoBotaoCancelar: 'Cancelar',
  desabilitarConfirmar: false,
  fecharAoClicarFora: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirmar': []
}>()

const handleBackdropClick = () => {
  if (props.fecharAoClicarFora) {
    emit('update:modelValue', false)
  }
}
</script>
