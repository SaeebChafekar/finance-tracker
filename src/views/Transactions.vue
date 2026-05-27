<template>
  <div class="p-8">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-900">Transactions</h2>
      <button @click="openAdd"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
        + Add Transaction
      </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-6">
      <select v-model="filterType"
              class="border border-slate-200 bg-white text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">All Types</option>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <select v-model="filterCategory"
              class="border border-slate-200 bg-white text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">All Categories</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="text-left px-5 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium">Date</th>
            <th class="text-left px-5 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium">Name</th>
            <th class="text-left px-5 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium">Category</th>
            <th class="text-left px-5 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium">Type</th>
            <th class="text-right px-5 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium">Amount</th>
            <th class="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="tx in filtered" :key="tx.id"
              class="hover:bg-slate-50 transition-colors">
            <td class="px-5 py-3 text-slate-400 font-mono text-xs">{{ tx.date }}</td>
            <td class="px-5 py-3 font-medium text-slate-900">{{ tx.name }}</td>
            <td class="px-5 py-3 text-slate-500">{{ tx.category }}</td>
            <td class="px-5 py-3">
              <span class="text-xs px-2 py-1 rounded-full font-medium"
                    :class="tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'">
                {{ tx.type }}
              </span>
            </td>
            <td class="px-5 py-3 text-right font-mono font-semibold"
                :class="tx.type === 'income' ? 'text-emerald-600' : 'text-rose-500'">
              {{ tx.type === 'income' ? '+' : '-' }}{{ fmt(tx.amount) }}
            </td>
            <!-- Edit + Delete buttons -->
            <td class="px-5 py-3">
              <div class="flex items-center justify-end gap-3">
                <button @click="openEdit(tx)"
                        class="text-xs text-slate-400 hover:text-blue-600 transition-colors">
                  Edit
                </button>
                <button @click="store.deleteTransaction(tx.id)"
                        class="text-xs text-slate-400 hover:text-rose-500 transition-colors">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!filtered.length" class="text-center text-slate-400 text-sm py-10">
        No transactions match this filter.
      </p>
    </div>

    <!-- Add / Edit Modal -->
    <div v-if="showModal"
         class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50"
         @click.self="closeModal">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

        <h3 class="text-lg font-bold text-slate-900 mb-5">
          {{ editingId ? 'Edit Transaction' : 'New Transaction' }}
        </h3>

        <div class="flex flex-col gap-4">
          <div>
            <label class="text-xs text-slate-500 mb-1 block">Name</label>
            <input v-model="form.name" placeholder="e.g. Grocery Store"
                   class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Amount</label>
              <input v-model="form.amount" type="number" step="0.01" placeholder="0.00"
                     class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Date</label>
              <input v-model="form.date" type="date"
                     class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Type</label>
              <select v-model="form.type"
                      class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Category</label>
              <select v-model="form.category"
                      class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="closeModal"
                  class="flex-1 border border-slate-200 text-slate-600 text-sm font-medium py-2 rounded-lg hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button @click="submit"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
            {{ editingId ? 'Save Changes' : 'Add' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFinanceStore } from '../stores/finance'

const store = useFinanceStore()

const showModal      = ref(false)
const editingId      = ref(null)   // null = adding, id = editing
const filterType     = ref('')
const filterCategory = ref('')

const categories = ['Food','Transport','Entertainment','Health','Shopping','Housing','Utilities','Income','Other']

const blankForm = () => ({
  name: '', amount: '', type: 'expense',
  category: 'Food', date: new Date().toISOString().slice(0, 10)
})

const form = ref(blankForm())

const filtered = computed(() =>
  store.transactions
    .filter(t => !filterType.value     || t.type     === filterType.value)
    .filter(t => !filterCategory.value || t.category === filterCategory.value)
)

function fmt(amount) {
  return '$' + Math.abs(Number(amount)).toLocaleString('en-US', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  })
}

// Open modal in ADD mode
function openAdd() {
  editingId.value = null
  form.value = blankForm()
  showModal.value = true
}

// Open modal in EDIT mode — prefill form with existing data
function openEdit(tx) {
  editingId.value = tx.id
  form.value = {
    name:     tx.name,
    amount:   tx.amount,
    type:     tx.type,
    category: tx.category,
    date:     tx.date,
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingId.value = null
  form.value = blankForm()
}

async function submit() {
  if (!form.value.name || !form.value.amount) return
  const payload = { ...form.value, amount: Number(form.value.amount) }

  if (editingId.value) {
    await store.editTransaction(editingId.value, payload)
  } else {
    await store.addTransaction(payload)
  }

  closeModal()
}

onMounted(() => { if (!store.transactions.length) store.fetchTransactions() })
</script>