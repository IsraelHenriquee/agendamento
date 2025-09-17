<template>
  <div class="w-20 bg-gray-50 border-r border-gray-300">
    <div class="py-2 pb-8">
      <div 
        v-for="(hora, index) in horarios" 
        :key="hora"
        class="flex items-start justify-center text-xs text-gray-600 font-medium pt-2 relative"
        :class="index < horarios.length - 1 ? 'border-b border-gray-200' : ''"
        style="height: 100px"
      >
        <span class="bg-gray-50 px-1 rounded text-center">{{ hora }}</span>
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
