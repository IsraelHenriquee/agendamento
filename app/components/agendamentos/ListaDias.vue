<template>
  <div class="flex">
    <!-- Espaçador para alinhar com a ReguaHorarios -->
    <div class="w-20"></div>
    
    <!-- Grid com os dias da semana ocupando todo o espaço -->
    <div class="flex flex-1 gap-2">
      <DiaItem 
        v-for="(dia, index) in diasSemana" 
        :key="index"
        :data="dia"
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
