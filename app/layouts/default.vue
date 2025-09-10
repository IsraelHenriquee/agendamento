<template>
  <div class="h-screen bg-neutral-50 flex overflow-hidden">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content -->
    <main class="flex-1 p-6 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Layout apenas com sidebar - sem props necessárias
</script>
