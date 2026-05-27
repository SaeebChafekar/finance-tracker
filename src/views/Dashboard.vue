<template>
  <div class="p-8">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Overview</h2>
        <p class="text-sm text-slate-500 mt-0.5">{{ currentMonth }}</p>
      </div>
      <button @click="showModal = true"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
        + Add Transaction
      </button>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-xs text-slate-500 uppercase tracking-wider mb-2">Net Balance</p>
        <p class="text-2xl font-mono font-semibold"
           :class="store.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-500'">
          {{ store.netBalance >= 0 ? '+' : '' }}{{ fmt(store.netBalance) }}
        </p>
        <p class="text-xs text-slate-400 mt-1">income − expenses</p>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-xs text-slate-500 uppercase tracking-wider mb-2">Monthly Spend</p>
        <p class="text-2xl font-mono font-semibold text-rose-500">{{ fmt(store.totalSpend) }}</p>
        <p class="text-xs text-slate-400 mt-1">
          {{ store.transactions.filter(t => t.type === 'expense').length }} transactions
        </p>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-xs text-slate-500 uppercase tracking-wider mb-2">Total Income</p>
        <p class="text-2xl font-mono font-semibold text-emerald-600">{{ fmt(store.totalIncome) }}</p>
        <p class="text-xs text-slate-400 mt-1">
          {{ store.transactions.filter(t => t.type === 'income').length }} transactions
        </p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-xs text-slate-500 uppercase tracking-wider mb-4">Spend by Category</p>
        <div ref="donutRef" class="flex justify-center"></div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-xs text-slate-500 uppercase tracking-wider mb-4">6-Month Trend</p>
        <div ref="barRef"></div>
      </div>
    </div>

    <!-- Recent transactions -->
    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
        <p class="text-xs text-slate-500 uppercase tracking-wider">Recent Transactions</p>
        <RouterLink to="/transactions" class="text-xs text-blue-600 hover:text-blue-700">View all →</RouterLink>
      </div>
      <div v-if="store.loading" class="px-5 py-8 text-center text-slate-400 text-sm">Loading...</div>
      <div v-else class="divide-y divide-slate-100">
        <div v-for="tx in store.recentTransactions" :key="tx.id"
             class="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
          <div>
            <p class="text-sm font-medium text-slate-900">{{ tx.name }}</p>
            <p class="text-xs text-slate-400 mt-0.5">{{ tx.date }} · {{ tx.category }}</p>
          </div>
          <p class="font-mono text-sm font-semibold"
             :class="tx.type === 'income' ? 'text-emerald-600' : 'text-rose-500'">
            {{ tx.type === 'income' ? '+' : '-' }}{{ fmt(tx.amount) }}
          </p>
        </div>
        <p v-if="!store.transactions.length" class="text-center text-slate-400 text-sm py-8">
          No transactions yet.
        </p>
      </div>
    </div>

    <!-- Add Transaction Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50"
         @click.self="showModal = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 class="text-lg font-bold text-slate-900 mb-5">New Transaction</h3>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import * as d3 from 'd3'
import { useFinanceStore } from '../stores/finance'

const store = useFinanceStore()

const showModal = ref(false)
const donutRef  = ref(null)
const barRef    = ref(null)

const categories = ['Food','Transport','Entertainment','Health','Shopping','Housing','Utilities','Income','Other']
const catColors  = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#84cc16','#ec4899']

const form = ref({
  name: '', amount: '', type: 'expense',
  category: 'Food', date: new Date().toISOString().slice(0, 10)
})

const currentMonth = computed(() =>
  new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
)

function fmt(amount) {
  return '$' + Math.abs(Number(amount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

async function submit() {
  console.log('form:', form.value)
  if (!form.value.name || !form.value.amount) return
  await store.addTransaction({ ...form.value, amount: Number(form.value.amount) })
  form.value = { name: '', amount: '', type: 'expense', category: 'Food', date: new Date().toISOString().slice(0, 10) }
  showModal.value = false
}

// ── D3 Donut Chart ──────────────────────────────────
function drawDonut() {
  if (!donutRef.value) return
  d3.select(donutRef.value).selectAll('*').remove()

  const data = Object.entries(store.categoryBreakdown)
  if (!data.length) return

  const W = 200, H = 200, R = 80, r = 50
  const svg = d3.select(donutRef.value).append('svg').attr('width', W).attr('height', H)
  const g   = svg.append('g').attr('transform', `translate(${W / 2},${H / 2})`)

  const color = d3.scaleOrdinal().domain(data.map(d => d[0])).range(catColors)
  const pie   = d3.pie().value(d => d[1]).sort(null)
  const arc   = d3.arc().outerRadius(R).innerRadius(r).cornerRadius(3).padAngle(0.03)

  g.selectAll('path')
    .data(pie(data))
    .join('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data[0]))
    .attr('opacity', 0.85)

  // Centre total
  g.append('text').attr('text-anchor', 'middle').attr('dy', '-0.2em')
    .style('font-size', '10px').style('fill', '#94a3b8').text('TOTAL')
  g.append('text').attr('text-anchor', 'middle').attr('dy', '1.1em')
    .style('font-size', '14px').style('font-weight', '700').style('fill', '#0f172a')
    .text(fmt(store.totalSpend))
}

// ── D3 Bar Chart ────────────────────────────────────
function drawBar() {
  if (!barRef.value) return
  d3.select(barRef.value).selectAll('*').remove()

  // Build last 6 months
  const months = Array.from({ length: 6 }, (_, i) => {
    const d   = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleString('default', { month: 'short' })
    const spend = store.transactions
      .filter(t => t.type === 'expense' && t.date?.startsWith(key))
      .reduce((s, t) => s + Number(t.amount), 0)
    return { label, spend }
  })

  const margin = { top: 10, right: 10, bottom: 28, left: 48 }
  const W = barRef.value.clientWidth || 300
  const H = 180
  const w = W - margin.left - margin.right
  const h = H - margin.top - margin.bottom

  const svg = d3.select(barRef.value).append('svg').attr('width', '100%').attr('height', H)
  const g   = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const x = d3.scaleBand().domain(months.map(m => m.label)).range([0, w]).padding(0.35)
  const y = d3.scaleLinear().domain([0, d3.max(months, m => m.spend) || 100]).nice().range([h, 0])

  // Grid lines
  g.selectAll('.grid').data(y.ticks(4)).join('line')
    .attr('x1', 0).attr('x2', w)
    .attr('y1', d => y(d)).attr('y2', d => y(d))
    .attr('stroke', '#e2e8f0')

  // Axes
  g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).tickSize(0))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('text').style('fill', '#94a3b8').style('font-size', '11px').attr('dy', '1.2em'))

  g.append('g').call(d3.axisLeft(y).ticks(4).tickFormat(d => '$' + d))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('.tick line').remove())
    .call(g => g.selectAll('text').style('fill', '#94a3b8').style('font-size', '10px'))

  // Bars
  g.selectAll('.bar').data(months).join('rect')
    .attr('x', d => x(d.label)).attr('width', x.bandwidth())
    .attr('y', d => y(d.spend)).attr('height', d => h - y(d.spend))
    .attr('rx', 4)
    .attr('fill', (_, i) => i === 5 ? '#2563eb' : '#bfdbfe')
}

function renderCharts() { nextTick(() => { drawDonut(); drawBar() }) }

onMounted(async () => {
  await store.fetchTransactions()
  renderCharts()
})

watch(() => store.transactions, renderCharts, { deep: true })
</script>