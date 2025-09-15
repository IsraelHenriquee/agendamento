<template>
  <div class="flex flex-col items-center py-4 px-3 bg-neutral-100 rounded-t-2xl cursor-pointer transition-colors">
    <!-- Número do dia -->
    <div class="text-2xl font-bold text-neutral-800 mb-1">
      {{ numeroDia }}
    </div>
    <!-- Dia da semana abreviado -->
    <div class="text-sm text-neutral-600 capitalize">
      {{ diaSemanaAbrev }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: Date
}

const props = defineProps<Props>()

// Computed para o número do dia
const numeroDia = computed(() => {
  return props.data.getDate()
})

// Computed para o dia da semana abreviado
const diaSemanaAbrev = computed(() => {
  const diasSemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
  return diasSemana[props.data.getDay()]
})
</script>
