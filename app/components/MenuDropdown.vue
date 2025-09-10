<template>
  <div class="relative">
    <!-- Trigger Button -->
    <button 
      @click="toggleDropdown"
      class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors group"
      :class="{ 'bg-neutral-50': isOpen }"
    >
      <div class="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
        <UserIcon class="w-4 h-4 text-neutral-600" />
      </div>
      <span class="font-medium">Configurações</span>
      <ChevronUpIcon 
        class="w-4 h-4 ml-auto transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div 
        v-if="isOpen"
        class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-neutral-200 rounded-lg shadow-lg py-1"
      >
        <!-- Perfil -->
        <button 
          @click="handleProfile"
          class="w-full flex items-center gap-3 px-3 py-2 text-left text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          <UserIcon class="w-4 h-4" />
          <span class="text-sm">Perfil</span>
        </button>

        <!-- Divider -->
        <div class="border-t border-neutral-100 my-1"></div>

        <!-- Sair -->
        <button 
          @click="handleLogout"
          :disabled="isLoading"
          class="w-full flex items-center gap-3 px-3 py-2 text-left text-danger-600 hover:bg-danger-50 transition-colors disabled:opacity-50"
        >
          <ArrowRightOnRectangleIcon class="w-4 h-4" />
          <span class="text-sm">{{ isLoading ? 'Saindo...' : 'Sair' }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  ChevronUpIcon
} from '@heroicons/vue/24/outline'

// Composables
const { logout } = useAuth()

// Estado do dropdown
const isOpen = ref(false)
const isLoading = ref(false)

// Toggle dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// Fechar dropdown quando clicar fora
const closeDropdown = () => {
  isOpen.value = false
}

// Handler para perfil (por enquanto sem ação)
const handleProfile = () => {
  console.log('Perfil clicado - funcionalidade em desenvolvimento')
  closeDropdown()
}

// Handler para logout
const handleLogout = async () => {
  try {
    isLoading.value = true
    await logout()
    closeDropdown()
  } catch (error) {
    console.error('Erro no logout:', error)
  } finally {
    isLoading.value = false
  }
}

// Fechar dropdown ao clicar fora
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element
    if (!target.closest('.relative')) {
      closeDropdown()
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
