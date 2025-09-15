<template>
  <div class="w-20 bg-neutral-100">
    <div class="py-2">
      <div 
        v-for="hora in horarios" 
        :key="hora"
        class="flex items-start justify-center border-b border-white text-xs text-neutral-500 pt-1"
        style="height: 100px"
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
