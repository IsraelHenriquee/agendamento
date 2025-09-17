<template>
  <div class="flex border border-gray-300 rounded-t-lg overflow-hidden bg-white shadow-sm">
    <!-- Espaçador para alinhar com a ReguaHorarios -->
    <div class="w-20 bg-gray-50 border-r border-gray-300 flex items-center justify-center">
      <span class="text-xs text-gray-500 font-medium">Horário</span>
    </div>
    
    <!-- Grid com os dias da semana ocupando todo o espaço -->
    <div class="flex flex-1">
      <DiaItem 
        v-for="(dia, index) in diasSemana" 
        :key="index"
        :data="dia"
        :isLast="index === diasSemana.length - 1"
        class="flex-1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Import do componente DiaItem
import DiaItem from './DiaItem.vue'

interface Props {
  diasSemana: Date[]
}

defineProps<Props>()
</script>
