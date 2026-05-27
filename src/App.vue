<template>
  <div class="min-h-screen bg-slate-50 flex">
    <AppSidebar />
    <main class="ml-64 flex-1 min-h-screen">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import AppSidebar from './components/AppSidebar.vue'
</script>