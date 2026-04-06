<template>
  <div class="flex bg-carbonblack text-stormyteal items-center justify-between ">
    
    <div>
      <h2>Overview</h2>
      <p></p>
      <button>+ Add Transaction</button>
    </div>

    <div>
      <div>
        <p>Net Balance</p>
        <p>{{ netBalance }}</p>
      </div>
      <div>
        <p>Monthly Spend</p>
        <p>{{ totalSpend }}</p>
      </div>
      <div>
        <p>Total Income</p>
        <p>{{ totalIncome }}</p>
      </div>
    </div>

    <div>
      <p>Recent Transactions</p>
      <div v-fo="trsx in recentTransactions" :key="trsx.id">
        <p>{{ trsx.name }}</p>
        <p>{{ trsx.data }} · {{ trsx.category }}</p>
        <p>{{ trsx.type === 'income' ? '+' : '-' }}{{ formatCurrency(trsx.amount) }}</p>

      </div>

    </div>


  </div>

</template>

<script setup>
  import { ref, computed } from 'vue';

  const transactions = ref([
    { id: 1, name: 'Salary',        amount: 4200,   type: 'income',  category: 'Income',        date: '2025-03-01' },
    { id: 2, name: 'Rent',          amount: 1200,   type: 'expense', category: 'Housing',       date: '2025-03-01' },
    { id: 3, name: 'Grocery Store', amount: 128.50, type: 'expense', category: 'Food',          date: '2025-03-03' },
    { id: 4, name: 'Metro Pass',    amount: 55,     type: 'expense', category: 'Transport',     date: '2025-03-04' },
    { id: 5, name: 'Pharmacy',      amount: 32.80,  type: 'expense', category: 'Health',        date: '2025-03-05' },
    { id: 6, name: 'Dinner Out',    amount: 67.20,  type: 'expense', category: 'Food',          date: '2025-03-07' },
    { id: 7, name: 'Amazon Order',  amount: 89.99,  type: 'expense', category: 'Shopping',      date: '2025-03-09' },
    { id: 8, name: 'Electric Bill', amount: 94.40,  type: 'expense', category: 'Utilities',     date: '2025-03-10' },
    { id: 9, name: 'Freelance',     amount: 600,    type: 'income',  category: 'Income',        date: '2025-03-12' },
    { id:10, name: 'Movie Tickets', amount: 28,     type: 'expense', category: 'Entertainment', date: '2025-03-15' },
  ])

  const budget = ref(30000)

  const totalSpend    = computed(() => transactions.value.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0))
  const totalIncome   = computed(() => transactions.value.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0))
  const netBalance    = computed(() => totalIncome.value - totalSpend.value)
  const expenseCount  = computed(() => transactions.value.filter(t => t.type === 'expense').length)
  const incomeCount   = computed(() => transactions.value.filter(t => t.type === 'income').length)
  const currentMonth  = computed(() => new Date().toLocaleString('default', { month: 'long', year: 'numeric' }))
  const recentTransactions = computed(() =>
    [...transactions.value].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  )

  function formatCurrency(amount) {
    return '$' + Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

</script>