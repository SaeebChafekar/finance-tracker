<template>
  <div class="p-8">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Subscriptions</h2>
        <p class="text-sm text-slate-500 mt-0.5">
          ${{ store.monthlySubCost.toFixed(2) }}/mo · ${{ (store.monthlySubCost * 12).toFixed(2) }}/yr
        </p>
      </div>
      <button @click="showModal = true"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
        + Add Subscription
      </button>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-xs text-slate-500 uppercase tracking-wider mb-2">Monthly Cost</p>
        <p class="text-2xl font-mono font-semibold text-blue-600">${{ store.monthlySubCost.toFixed(2) }}</p>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-xs text-slate-500 uppercase tracking-wider mb-2">Annual Cost</p>
        <p class="text-2xl font-mono font-semibold text-emerald-600">${{ (store.monthlySubCost * 12).toFixed(2) }}</p>
      </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-3 gap-4">
      <div v-for="sub in store.subscriptions" :key="sub.id"
           class="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
        <div class="flex items-start justify-between mb-3">
          <p class="font-semibold text-slate-900">{{ sub.name }}</p>
          <button @click="store.deleteSubscription(sub.id)"
                  class="text-slate-300 hover:text-rose-500 transition-colors text-xs">✕</button>
        </div>
        <p class="text-xs text-slate-400 mb-3">{{ sub.category }}</p>
        <div class="flex items-center justify-between">
          <span class="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{{ sub.cycle }}</span>
          <p class="font-mono font-semibold text-blue-600">${{ Number(sub.amount).toFixed(2) }}</p>
        </div>
        <p class="text-xs text-slate-400 mt-2 font-mono">Next: {{ sub.next_date }}</p>
      </div>
    </div>
    <p v-if="!store.subscriptions.length" class="text-center text-slate-400 text-sm py-10">
      No subscriptions yet.
    </p>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50"
         @click.self="showModal = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 class="text-lg font-bold text-slate-900 mb-5">New Subscription</h3>
        <div class="flex flex-col gap-4">
          <div>
            <label class="text-xs text-slate-500 mb-1 block">Service Name</label>
            <input v-model="form.name" placeholder="e.g. Netflix"
                   class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Amount</label>
              <input v-model="form.amount" type="number" step="0.01" placeholder="0.00"
                     class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Billing Cycle</label>
              <select v-model="form.cycle"
                      class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Category</label>
              <select v-model="form.category"
                      class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Next Billing Date</label>
              <input v-model="form.next_date" type="date"
                     class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="showModal = false"
                  class="flex-1 border border-slate-200 text-slate-600 text-sm font-medium py-2 rounded-lg hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button @click="submit"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
            Add
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFinanceStore } from '../stores/finance'

const store = useFinanceStore()
const showModal = ref(false)
const categories = ['Food','Transport','Entertainment','Health','Shopping','Housing','Utilities','Other']

const form = ref({
  name: '', amount: '', cycle: 'monthly',
  category: 'Entertainment', next_date: new Date().toISOString().slice(0, 10)
})

async function submit() {
  if (!form.value.name || !form.value.amount) return
  await store.addSubscription({ ...form.value, amount: Number(form.value.amount) })
  form.value = { name: '', amount: '', cycle: 'monthly', category: 'Entertainment', next_date: new Date().toISOString().slice(0, 10) }
  showModal.value = false
}

onMounted(() => { if (!store.subscriptions.length) store.fetchSubscriptions() })
</script>