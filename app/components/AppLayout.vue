<template>
  <div class="min-h-screen bg-neutral-50 flex">
    <!-- Sidebar -->
    <div class="w-64 flex-shrink-0">
      <Sidebar />
    </div>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0">
      <!-- Top Header (opcional) -->
      <header class="bg-white shadow-soft border-b border-neutral-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 v-if="pageTitle" class="text-2xl font-bold text-neutral-800">{{ pageTitle }}</h1>
            <p v-if="pageDescription" class="text-neutral-600 mt-1">{{ pageDescription }}</p>
          </div>
          
          <!-- Actions slot para botões da página -->
          <div class="flex items-center gap-3">
            <slot name="header-actions" />
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <div class="flex-1 p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
interface Props {
  pageTitle?: string
  pageDescription?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageTitle: '',
  pageDescription: ''
})
</script>
