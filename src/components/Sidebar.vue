<template>
   <aside class="fixed h-full flex flex-col bg-carbonblack w-52 left-0 top-0 py-4 px-5 ">
      
      <!-- Site Name and Logo -->
      <div class="mb-10 px-2">
         <h1 class="text-zinc-200">Personal Finance Tracker</h1>
         <p class=""> something... </p>
      </div>


      <!-- Navigation Link to other views -->
      <div>
         <nav class=" flex flex-col gap-1.5 flex-1">
            <RouterLink class="flex items-center text-seeweed gap-1 bg-stormyteal px-2 py-1 rounded-md"
               v-for="link in links"
               :key="link.path"
               :to="link.path"
            >
               <span></span>
               {{link.lable}}
            </RouterLink>
         </nav>
      </div>

 
   </aside> 
</template>

<script setup>

   const links = [
      { path: '/', lable: 'Dashboard' },
      { path: '/analytics', lable: 'Analytics' },
      { path: '/transactions', lable: 'Transactions' },
      { path: '/subscriptions', lable: 'Subscriptins' },
   ]

</script>