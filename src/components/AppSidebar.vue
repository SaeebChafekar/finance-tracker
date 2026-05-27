<template>
  <aside class="fixed left-0 top-0 h-full w-64 flex flex-col py-8 px-4 bg-slate-900 z-20">

    <!-- Logo -->
    <div class="mb-10 px-2">
      <h1 class="text-2xl font-bold text-white tracking-tight">Ledger</h1>
      <p class="text-xs text-slate-400 mt-1">Personal Finance</p>
    </div>

    <!-- Nav -->
    <nav class="flex flex-col gap-1 flex-1">
      <RouterLink
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        active-class="text-white bg-blue-600 hover:bg-blue-600"
      >
        <span>{{ link.icon }}</span>
        {{ link.label }}
      </RouterLink>
    </nav>

    <!-- Budget progress -->
    <div class="px-2 mt-auto">
      <div class="flex justify-between text-xs mb-2 text-slate-400">
        <span>Monthly Budget</span>
        <span class="text-blue-400">${{ store.totalSpend.toFixed(0) }}</span>
      </div>
      <div class="h-1.5 rounded-full bg-slate-700 overflow-hidden">
        <div
          class="h-full rounded-full bg-blue-500 transition-all duration-500"
          :style="{ width: Math.min((store.totalSpend / budget) * 100, 100) + '%' }"
        />
      </div>
      <p class="text-xs text-slate-600 mt-2">${{ budget.toLocaleString() }} limit</p>
    </div>

  </aside>
</template>

<script setup>
import { useFinanceStore } from '../stores/finance'

const store  = useFinanceStore()
const budget = 3000

const links = [
  { path: '/',               icon: '⊞', label: 'Dashboard'     },
  { path: '/transactions',   icon: '↕', label: 'Transactions'  },
  { path: '/subscriptions',  icon: '↺', label: 'Subscriptions' },
  { path: '/analytics',      icon: '◎', label: 'Analytics'     },
]
</script>aaaaaaaaaaa