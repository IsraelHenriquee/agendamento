<template>
  <div class="text-center">
    <template v-if="loading">
      <div class="animate-pulse">
        <div class="h-5 bg-neutral-300 rounded w-32 mb-1"></div>
        <div class="h-4 bg-neutral-300 rounded w-24"></div>
      </div>
    </template>
    
    <template v-else-if="error">
      <p class="text-sm text-red-500">Erro ao carregar profissional</p>
    </template>
    
    <template v-else-if="profissionalAtual">
      <h2 class="text-lg font-semibold text-neutral-800">
        {{ profissionalAtual.nome }}
      </h2>
      <p class="text-sm text-neutral-500">
        {{ profissionalAtual.especialidade }}
      </p>
    </template>
    
    <template v-else>
      <p class="text-sm text-neutral-400">Nenhum profissional encontrado</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { AgProfissional } from '../../../shared/types/database'

// Estado reativo
const profissionais = ref<AgProfissional[]>([])
const profissionalAtual = ref<AgProfissional | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Store de usuário para pegar o profile logado
const userStore = useUserStore()

// Composable para buscar dados
const { fetchProfissionais } = useProfissionais()

// Função para carregar profissionais
const carregarProfissionais = async () => {
  loading.value = true
  error.value = null
  
  try {
    const dados = await fetchProfissionais()
    profissionais.value = dados
    
    // Busca o profissional logado pelo profile_id
    if (dados && dados.length > 0) {
      const profileId = userStore.profile?.id
      
      if (profileId) {
        // Procura o profissional com o profile_id do usuário logado
        const profissionalLogado = dados.find(prof => prof.profile_id === profileId)
        
        if (profissionalLogado) {
          profissionalAtual.value = profissionalLogado
        } else {
          // Se não encontrar o profissional logado, exibe o primeiro da lista
          profissionalAtual.value = dados[0] || null
        }
      } else {
        // Se não houver profile, exibe o primeiro da lista
        profissionalAtual.value = dados[0] || null
      }
    }
  } catch (err: any) {
    console.error('Erro ao buscar profissionais:', err)
    error.value = err.message || 'Erro ao carregar profissionais'
  } finally {
    loading.value = false
  }
}

// Carregar dados ao montar o componente
onMounted(() => {
  carregarProfissionais()
})

// Watch para recarregar quando o profile do usuário mudar
watch(() => userStore.profile, () => {
  if (profissionais.value.length > 0) {
    carregarProfissionais()
  }
})
</script>
