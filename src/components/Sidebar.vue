<template>
   <aside class="fixed h-full flex flex-col bg-zinc-900 w-52 left-0 top-0 py-4 px-5 ">
      
      <!-- Site Name and Logo -->
      <div class="mb-10 px-2">
         <h1 class="text-zinc-200 text-center">Personal Finance Tracker</h1>
         <p class="text-zinc-200"> Placeholder...</p>
      </div>


      <!-- Navigation Link to other views -->
      <div>
         <nav class=" flex flex-col gap-1.5 flex-1">
            <RouterLink class="flex items-center font-semibold text-sm text-zinc-950 gap-1 bg-amber-500 px-2 py-1.5 rounded-md"
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