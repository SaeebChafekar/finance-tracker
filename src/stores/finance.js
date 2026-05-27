import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API = 'http://localhost:3000/api'

export const useFinanceStore = defineStore('finance', () => {

  const transactions  = ref([])
  const subscriptions = ref([])
  const loading       = ref(false)

  // ── Getters ──────────────────────────────────────
  const totalSpend  = computed(() =>
    transactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  )

  const totalIncome = computed(() =>
    transactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  )

  const netBalance     = computed(() => totalIncome.value - totalSpend.value)

  const monthlySubCost = computed(() =>
    subscriptions.value.reduce((sum, s) => {
      if (s.cycle === 'monthly') return sum + Number(s.amount)
      if (s.cycle === 'annual')  return sum + Number(s.amount) / 12
      if (s.cycle === 'weekly')  return sum + Number(s.amount) * 4.33
      return sum + Number(s.amount)
    }, 0)
  )

  const categoryBreakdown = computed(() => {
    const map = {}
    transactions.value
      .filter(t => t.type === 'expense')
      .forEach(t => { map[t.category] = (map[t.category] || 0) + Number(t.amount) })
    return map
  })

  const recentTransactions = computed(() =>
    [...transactions.value]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  )

  // ── Actions ──────────────────────────────────────
  async function fetchTransactions() {
    loading.value = true
    try {
      const res  = await fetch(`${API}/transactions`)
      transactions.value = await res.json()
    } finally {
      loading.value = false
    }
  }

  async function addTransaction(tx) {
    const res  = await fetch(`${API}/transactions`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(tx),
    })
    const data = await res.json()
    transactions.value.unshift(data)
  }

  async function editTransaction(id, updates) {
    const res  = await fetch(`${API}/transactions/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(updates),
    })
    const data = await res.json()
    const idx  = transactions.value.findIndex(t => t.id === id)
    if (idx !== -1) transactions.value[idx] = data
  }

  async function deleteTransaction(id) {
    await fetch(`${API}/transactions/${id}`, { method: 'DELETE' })
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  async function fetchSubscriptions() {
    loading.value = true
    try {
      const res  = await fetch(`${API}/subscriptions`)
      subscriptions.value = await res.json()
    } finally {
      loading.value = false
    }
  }

  async function addSubscription(sub) {
    const res  = await fetch(`${API}/subscriptions`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(sub),
    })
    const data = await res.json()
    subscriptions.value.unshift(data)
  }

  async function deleteSubscription(id) {
    await fetch(`${API}/subscriptions/${id}`, { method: 'DELETE' })
    subscriptions.value = subscriptions.value.filter(s => s.id !== id)
  }

  return {
    transactions, subscriptions, loading,
    totalSpend, totalIncome, netBalance, monthlySubCost,
    categoryBreakdown, recentTransactions,
    fetchTransactions, addTransaction, deleteTransaction,
    fetchSubscriptions, addSubscription, deleteSubscription,
    editTransaction,
  }
})