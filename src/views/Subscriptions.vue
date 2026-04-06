<template>
  <div class="p-8">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-semibold">Subscriptions</h2>
        <p class="text-sm text-zinc-500 mt-1">${{ monthlyTotal.toFixed(2) }}/mo across {{ subscriptions.length }} services</p>
      </div>
      <button class="bg-amber-500 text-zinc-950 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors">
        + Add Subscription
      </button>
    </div>

    <!-- Summary row -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 uppercase tracking-wider mb-1">Monthly Cost</p>
        <p class="text-2xl font-mono text-amber-400">₹{{ monthlyTotal.toFixed(2) }}</p>
      </div>
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 uppercase tracking-wider mb-1">Annual Cost</p>
        <p class="text-2xl font-mono text-emerald-400">₹{{ (monthlyTotal * 12).toFixed(2) }}</p>
      </div>
    </div>

    <!-- Subscriptions grid -->
    <div class="grid grid-cols-3 gap-4">
      <div v-for="sub in subscriptions" :key="sub.id"
           class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
        <div class="flex items-center justify-between mb-3">
          <p class="font-semibold text-zinc-100">{{ sub.name }}</p>
          <span class="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">{{ sub.cycle }}</span>
        </div>
        <p class="text-xs text-zinc-500 mb-3">{{ sub.category }}</p>
        <div class="flex items-center justify-between">
          <p class="text-xs text-zinc-600 font-mono">Next: {{ sub.nextDate }}</p>
          <p class="font-mono text-amber-400 font-medium">₹{{ Number(sub.amount).toFixed(2) }}</p>
        </div>
      </div>
    </div>

    <p v-if="!subscriptions.length" class="text-center text-zinc-500 text-sm py-8">
      No subscriptions yet.
    </p>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const subscriptions = ref([
  { id: 1, name: 'Netflix',   amount: 15.99, cycle: 'monthly', category: 'Entertainment', nextDate: '2025-04-01' },
  { id: 2, name: 'Spotify',   amount: 9.99,  cycle: 'monthly', category: 'Entertainment', nextDate: '2025-04-05' },
  { id: 3, name: 'iCloud',    amount: 2.99,  cycle: 'monthly', category: 'Utilities',     nextDate: '2025-04-08' },
  { id: 4, name: 'Adobe CC',  amount: 54.99, cycle: 'monthly', category: 'Other',         nextDate: '2025-04-15' },
  { id: 5, name: 'GitHub Pro',amount: 4.00,  cycle: 'monthly', category: 'Other',         nextDate: '2025-04-18' },
])

const monthlyTotal = computed(() =>
  subscriptions.value.reduce((sum, s) => {
    if (s.cycle === 'monthly') return sum + Number(s.amount)
    if (s.cycle === 'annual')  return sum + Number(s.amount) / 12
    if (s.cycle === 'weekly')  return sum + Number(s.amount) * 4.33
    return sum + Number(s.amount)
  }, 0)
)
</script>