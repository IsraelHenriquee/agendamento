<template>
  <div 
    class="flex flex-col items-center py-3 px-2 bg-white hover:bg-blue-50 transition-colors duration-200 relative group"
    :class="[
      !isLast ? 'border-r border-gray-300' : '',
      isHoje ? 'bg-blue-50' : ''
    ]"
  >
    <!-- Indicador de hoje -->
    <div 
      v-if="isHoje"
      class="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"
    ></div>
    
    <!-- Número do dia -->
    <div 
      class="text-2xl font-bold mb-1 transition-colors duration-200"
      :class="[
        isHoje ? 'text-blue-700' : 'text-gray-700',
        'group-hover:text-blue-600'
      ]"
    >
      {{ numeroDia }}
    </div>
    
    <!-- Dia da semana abreviado -->
    <div 
      class="text-xs font-medium capitalize tracking-wide transition-colors duration-200"
      :class="[
        isHoje ? 'text-blue-600' : 'text-gray-500',
        'group-hover:text-blue-600'
      ]"
    >
      {{ diaSemanaAbrev }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: Date
  isLast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLast: false
})

// Computed para o número do dia
const numeroDia = computed(() => {
  return props.data.getDate()
})

// Computed para o dia da semana abreviado
const diaSemanaAbrev = computed(() => {
  const diasSemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
  return diasSemana[props.data.getDay()]
})

// Computed para verificar se é hoje
const isHoje = computed(() => {
  const hoje = new Date()
  return props.data.toDateString() === hoje.toDateString()
})
</script>
