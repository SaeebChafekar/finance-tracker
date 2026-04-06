<template>
  <div class="p-8">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold">Transactions</h2>
      <button class="bg-amber-500 text-zinc-950 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors">
        + Add Transaction
      </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-6">
      <select v-model="filterType" class="bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-3 py-2">
        <option value="">All Types</option>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <select v-model="filterCategory" class="bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-3 py-2">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Table -->
    <div class="border border-zinc-800 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-zinc-900 text-zinc-500 text-xs uppercase tracking-wider">
          <tr>
            <th class="text-left px-4 py-3">Date</th>
            <th class="text-left px-4 py-3">Name</th>
            <th class="text-left px-4 py-3">Category</th>
            <th class="text-left px-4 py-3">Type</th>
            <th class="text-right px-4 py-3">Amount</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800">
          <tr v-for="tx in filteredTransactions" :key="tx.id"
              class="bg-zinc-950 hover:bg-zinc-900 transition-colors">
            <td class="px-4 py-3 text-zinc-400 font-mono">{{ tx.date }}</td>
            <td class="px-4 py-3 text-zinc-100">{{ tx.name }}</td>
            <td class="px-4 py-3 text-zinc-400">{{ tx.category }}</td>
            <td class="px-4 py-3">
              <span class="text-xs px-2 py-1 rounded-full"
                    :class="tx.type === 'income' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'">
                {{ tx.type }}
              </span>
            </td>
            <td class="px-4 py-3 text-right font-mono"
                :class="tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'">
              {{ tx.type === 'income' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!filteredTransactions.length" class="text-center text-zinc-500 text-sm py-8">
        No transactions match this filter.
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filterType     = ref('')
const filterCategory = ref('')

const categories = ['Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Housing', 'Utilities', 'Income', 'Other']

const transactions = ref([
  { id: 1,  name: 'Salary',        amount: 4200,   type: 'income',  category: 'Income',        date: '2025-03-01' },
  { id: 2,  name: 'Rent',          amount: 1200,   type: 'expense', category: 'Housing',       date: '2025-03-01' },
  { id: 3,  name: 'Grocery Store', amount: 428.50, type: 'expense', category: 'Food',          date: '2025-03-03' },
  { id: 4,  name: 'Metro Pass',    amount: 55,     type: 'expense', category: 'Transport',     date: '2025-03-04' },
  { id: 5,  name: 'Pharmacy',      amount: 120.80,  type: 'expense', category: 'Health',        date: '2025-03-05' },
  { id: 6,  name: 'Dinner Out',    amount: 67.20,  type: 'expense', category: 'Food',          date: '2025-03-07' },
  { id: 7,  name: 'Amazon Order',  amount: 899.99,  type: 'expense', category: 'Shopping',      date: '2025-03-09' },
  { id: 8,  name: 'Electric Bill', amount: 940.40,  type: 'expense', category: 'Utilities',     date: '2025-03-10' },
  { id: 9,  name: 'Freelance',     amount: 600,    type: 'income',  category: 'Income',        date: '2025-03-12' },
  { id: 10, name: 'Movie Tickets', amount: 280,     type: 'expense', category: 'Entertainment', date: '2025-03-15' },
])

const filteredTransactions = computed(() =>
  transactions.value
    .filter(t => !filterType.value     || t.type     === filterType.value)
    .filter(t => !filterCategory.value || t.category === filterCategory.value)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
)

function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>