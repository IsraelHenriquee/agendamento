<template>
  <div class="flex flex-col items-center py-3 border-r border-neutral-200 last:border-r-0 hover:bg-neutral-50 cursor-pointer transition-colors">
    <!-- Dia da semana abreviado -->
    <div class="text-xs text-neutral-500 uppercase font-medium mb-1">
      {{ diaSemanaAbrev }}
    </div>
    <!-- Número do dia -->
    <div class="text-xl font-semibold text-neutral-800">
      {{ numeroDia }}
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
