<template>
  <aside 
    class="bg-white border-r border-neutral-200 h-screen flex flex-col flex-shrink-0 transition-all duration-300"
    :class="isCollapsed ? 'w-16' : 'w-64'"
  >
    <!-- Header do Sidebar -->
    <header class="border-b border-neutral-200" :class="isCollapsed ? 'p-3' : 'p-6'">
      <div v-if="!isCollapsed" class="flex items-center gap-3">
        <div class="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
          <CalendarIcon class="w-6 h-6 text-white" />
        </div>
        <div class="flex-1">
          <h1 class="text-lg font-bold text-neutral-800">AgendaPro</h1>
          <p class="text-xs text-neutral-500">Sistema de Agendamento</p>
        </div>
        <!-- Toggle Button quando expandido -->
        <button 
          @click="toggleSidebar"
          class="p-1 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <ChevronLeftIcon class="w-5 h-5 text-neutral-600 transition-transform duration-300" />
        </button>
      </div>
      
      <!-- Apenas seta quando colapsado -->
      <div v-else class="flex justify-center">
        <button 
          @click="toggleSidebar"
          class="p-1 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <ChevronLeftIcon class="w-5 h-5 text-neutral-600 transition-transform duration-300 rotate-180" />
        </button>
      </div>
    </header>

    <!-- Menu Principal -->
    <nav class="flex-1 overflow-y-auto" :class="isCollapsed ? 'p-2' : 'p-4'">
      <div :class="isCollapsed ? 'space-y-1' : 'space-y-2'">
        <!-- Dashboard -->
        <NuxtLink 
          to="/" 
          class="flex items-center rounded-lg text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors group"
          :class="isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'"
          active-class="bg-primary-100 text-primary-700"
          :title="isCollapsed ? 'Dashboard' : undefined"
        >
          <ChartBarIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isCollapsed" class="font-medium">Dashboard</span>
        </NuxtLink>

        <!-- Especialidades -->
        <NuxtLink 
          to="/especialidades"
          class="flex items-center rounded-lg text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors group"
          :class="isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'"
          active-class="bg-primary-100 text-primary-700"
          :title="isCollapsed ? 'Especialidades' : undefined"
        >
          <FunnelIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isCollapsed" class="font-medium">Especialidades</span>
        </NuxtLink>

        <!-- Agendamentos -->
        <NuxtLink 
          to="/agendamentos"
          class="flex items-center rounded-lg text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors group"
          :class="isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'"
          active-class="bg-primary-100 text-primary-700"
          :title="isCollapsed ? 'Agendamentos' : undefined"
        >
          <CalendarIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isCollapsed" class="font-medium">Agendamentos</span>
        </NuxtLink>

        <!-- Clientes -->
        <NuxtLink 
          to="/clientes"
          class="flex items-center rounded-lg text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors group"
          :class="isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'"
          active-class="bg-primary-100 text-primary-700"
          :title="isCollapsed ? 'Clientes' : undefined"
        >
          <UserGroupIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isCollapsed" class="font-medium">Clientes</span>
        </NuxtLink>

        <!-- Profissionais -->
        <NuxtLink 
          to="/profissionais"
          class="flex items-center rounded-lg text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors group"
          :class="isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'"
          active-class="bg-primary-100 text-primary-700"
          :title="isCollapsed ? 'Profissionais' : undefined"
        >
          <UserIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isCollapsed" class="font-medium">Profissionais</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Footer da Sidebar -->
    <footer class="border-t border-neutral-200" :class="isCollapsed ? 'p-2' : 'p-4'">
      <!-- Menu Dropdown quando expandido -->
      <MenuDropdown v-if="!isCollapsed" />
      
      <!-- Menu Dropdown quando colapsado -->
      <div v-else class="relative">
        <button 
          @click="toggleCollapsedMenu"
          class="w-full flex items-center justify-center p-3 rounded-lg text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          title="Configurações"
        >
          <UserIcon class="w-5 h-5" />
        </button>
        
        <!-- Dropdown quando colapsado e menu aberto -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div 
            v-if="showCollapsedMenu"
            class="absolute bottom-full left-0 mb-2 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 min-w-[150px]"
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
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { 
  CalendarIcon,
  ChartBarIcon,
  UserGroupIcon,
  UserIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

// Composables
const { logout } = useAuth()

// Estado do sidebar
const isCollapsed = ref(false)
const showCollapsedMenu = ref(false)
const isLoading = ref(false)

// Função para alternar o estado do sidebar
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  // Fechar menu colapsado quando expandir
  if (!isCollapsed.value) {
    showCollapsedMenu.value = false
  }
}

// Função para alternar o menu quando colapsado
const toggleCollapsedMenu = () => {
  showCollapsedMenu.value = !showCollapsedMenu.value
}

// Handler para perfil (por enquanto sem ação)
const handleProfile = () => {
  console.log('Perfil clicado - funcionalidade em desenvolvimento')
  showCollapsedMenu.value = false
}

// Handler para logout
const handleLogout = async () => {
  try {
    isLoading.value = true
    await logout()
    showCollapsedMenu.value = false
  } catch (error) {
    console.error('Erro no logout:', error)
  } finally {
    isLoading.value = false
  }
}

// Fechar menu colapsado ao clicar fora
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element
    if (!target.closest('footer')) {
      showCollapsedMenu.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
