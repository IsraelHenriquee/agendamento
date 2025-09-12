<template>
  <div class="flex flex-col items-center gap-3">
    <!-- Texto com período da semana -->
    <div class="text-center">
      <p class="text-lg font-semibold text-neutral-800">
        {{ formatarData(primeiraData) }} - {{ formatarData(ultimaData) }}
      </p>
    
    </div>
    
    <!-- Botões de navegação -->
    <div class="flex items-center gap-2">
      <button
        @click="agendamentoStore.voltarSemana()"
        class="p-2 rounded-lg bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 transition-all duration-200 shadow-sm"
        title="Semana anterior"
      >
        <svg class="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        @click="agendamentoStore.avancarSemana()"
        class="p-2 rounded-lg bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 transition-all duration-200 shadow-sm"
        title="Próxima semana"
      >
        <svg class="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Store de agendamento
const agendamentoStore = useAgendamentoStore()

// Computed para primeira e última data da semana
const primeiraData = computed(() => agendamentoStore.diasSemana[0])
const ultimaData = computed(() => agendamentoStore.diasSemana[6])

// Função para formatar data no formato DD/MM
const formatarData = (data: Date | undefined) => {
  if (!data) return '--/--'
  
  const dia = data.getDate().toString().padStart(2, '0')
  const mes = (data.getMonth() + 1).toString().padStart(2, '0')
  return `${dia}/${mes}`
}
</script>
