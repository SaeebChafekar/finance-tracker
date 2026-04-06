<script setup>
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div>

    <Sidebar />
    
    <main class="ml-52">
      <RouterView />
    </main>

  </div>
</template>
