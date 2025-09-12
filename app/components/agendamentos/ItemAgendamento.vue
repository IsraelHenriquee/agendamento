<template>
  <div class="flex-1 border-r border-neutral-200 last:border-r-0 bg-white">
    <!-- Header do dia (para debug) -->
    <div class="text-center p-2 text-xs text-neutral-400 border-b border-neutral-100">
      {{ formatarData(data) }}
    </div>
    
    <!-- Área dos slots de agendamento -->
    <div class="h-full">
      <!-- Aqui serão os slots de agendamento -->
      <div class="p-2 text-center text-xs text-neutral-300">
        Slots do dia
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: Date
}

const props = defineProps<Props>()

// Função para formatar data no formato DD/MM
const formatarData = (data: Date) => {
  const dia = data.getDate().toString().padStart(2, '0')
  const mes = (data.getMonth() + 1).toString().padStart(2, '0')
  return `${dia}/${mes}`
}
</script>
