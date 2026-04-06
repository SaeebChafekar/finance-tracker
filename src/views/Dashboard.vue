<template>
  <div class="p-8">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-semibold">Overview</h2>
        <p class="text-sm text-zinc-500 mt-1">{{ currentMonth }}</p>
      </div>
      <button class="bg-amber-500 text-zinc-950 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors">
        + Add Transaction
      </button>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-3 gap-4 mb-6">

      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
        <p class="text-xs text-zinc-500 uppercase tracking-wider mb-2">Net Balance</p>
        <p class="text-2xl font-mono font-medium"
           :class="netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'">
          {{ netBalance >= 0 ? '+' : '' }}{{ formatCurrency(netBalance) }}
        </p>
        <p class="text-xs text-zinc-600 font-mono mt-1">income − expenses</p>
      </div>

      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
        <p class="text-xs text-zinc-500 uppercase tracking-wider mb-2">Monthly Spend</p>
        <p class="text-2xl font-mono font-medium text-rose-400">
          {{ formatCurrency(totalSpend) }}
        </p>
        <p class="text-xs text-zinc-600 font-mono mt-1">{{ expenseCount }} transactions</p>
      </div>

      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
        <p class="text-xs text-zinc-500 uppercase tracking-wider mb-2">Total Income</p>
        <p class="text-2xl font-mono font-medium text-emerald-400">
          {{ formatCurrency(totalIncome) }}
        </p>
        <p class="text-xs text-zinc-600 font-mono mt-1">{{ incomeCount }} transactions</p>
      </div>

    </div>

    <!-- Charts row — placeholders for now -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <p class="text-xs text-zinc-500 uppercase tracking-wider mb-4">Spend by Category</p>
        <div id="donut-chart" class="flex justify-center"></div>
      </div>
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <p class="text-xs text-zinc-500 uppercase tracking-wider mb-4">6-Month Trend</p>
        <div id="bar-chart"></div>
      </div>
    </div>

    <!-- Recent transactions -->
    <div class="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-zinc-800">
        <p class="text-xs text-zinc-500 uppercase tracking-wider">Recent Transactions</p>
      </div>
      <div class="divide-y divide-zinc-800">
        <div v-for="tx in recentTransactions" :key="tx.id"
             class="flex items-center justify-between px-5 py-3 hover:bg-zinc-800/50 transition-colors">
          <div>
            <p class="text-sm text-zinc-100">{{ tx.name }}</p>
            <p class="text-xs text-zinc-500 font-mono mt-0.5">{{ tx.date }} · {{ tx.category }}</p>
          </div>
          <p class="font-mono text-sm font-medium"
             :class="tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'">
            {{ tx.type === 'income' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const transactions = ref([
  { id: 1,  name: 'Salary',        amount: 4200,   type: 'income',  category: 'Income',        date: '2025-03-01' },
  { id: 2,  name: 'Rent',          amount: 1200,   type: 'expense', category: 'Housing',       date: '2025-03-01' },
  { id: 3,  name: 'Grocery Store', amount: 128.50, type: 'expense', category: 'Food',          date: '2025-03-03' },
  { id: 4,  name: 'Metro Pass',    amount: 55,     type: 'expense', category: 'Transport',     date: '2025-03-04' },
  { id: 5,  name: 'Pharmacy',      amount: 120.80,  type: 'expense', category: 'Health',        date: '2025-03-05' },
  { id: 6,  name: 'Dinner Out',    amount: 320.20,  type: 'expense', category: 'Food',          date: '2025-03-07' },
  { id: 7,  name: 'Amazon Order',  amount: 599.99,  type: 'expense', category: 'Shopping',      date: '2025-03-09' },
  { id: 8,  name: 'Electric Bill', amount: 940.40,  type: 'expense', category: 'Utilities',     date: '2025-03-10' },
  { id: 9,  name: 'Freelance',     amount: 600,    type: 'income',  category: 'Income',        date: '2025-03-12' },
  { id: 10, name: 'Movie Tickets', amount: 280,     type: 'expense', category: 'Entertainment', date: '2025-03-15' },
])

const budget = ref(3000)

const totalSpend   = computed(() => transactions.value.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0))
const totalIncome  = computed(() => transactions.value.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0))
const netBalance   = computed(() => totalIncome.value - totalSpend.value)
const expenseCount = computed(() => transactions.value.filter(t => t.type === 'expense').length)
const incomeCount  = computed(() => transactions.value.filter(t => t.type === 'income').length)
const currentMonth = computed(() => new Date().toLocaleString('default', { month: 'long', year: 'numeric' }))

const recentTransactions = computed(() =>
  [...transactions.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
)

function formatCurrency(amount) {
  return '₹' + Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>