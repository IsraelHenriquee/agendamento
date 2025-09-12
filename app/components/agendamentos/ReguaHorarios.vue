<template>
  <div class="w-20 border-r border-neutral-200 bg-neutral-50">
    <div class="py-2">
      <div 
        v-for="hora in horarios" 
        :key="hora"
        class="h-16 flex items-start justify-center border-b border-neutral-100 text-xs text-neutral-500 pt-1"
      >
        {{ hora }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Gera array de horários de 8h às 22h
const horarios = computed(() => {
  const horas = []
  for (let i = 8; i <= 22; i++) {
    horas.push(`${i.toString().padStart(2, '0')}:00`)
  }
  return horas
})
</script>
