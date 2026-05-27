<template>
  <div class="p-8">

    <div class="mb-6">
      <h2 class="text-2xl font-bold text-slate-900">Analytics</h2>
      <p class="text-sm text-slate-500 mt-0.5">Spending breakdown & trends</p>
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

    <!-- Category breakdown table -->
    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-100">
        <p class="text-xs text-slate-500 uppercase tracking-wider">Category Breakdown</p>
      </div>
      <div class="p-5 flex flex-col gap-3">
        <div v-for="(val, cat) in store.categoryBreakdown" :key="cat"
             class="flex items-center gap-4">
          <p class="text-sm font-medium text-slate-700 w-28 shrink-0">{{ cat }}</p>
          <div class="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div class="h-full rounded-full bg-blue-500 transition-all duration-500"
                 :style="{ width: (val / maxCat * 100) + '%' }"/>
          </div>
          <p class="text-sm font-mono font-semibold text-slate-700 w-20 text-right shrink-0">
            ${{ Number(val).toFixed(2) }}
          </p>
        </div>
        <p v-if="!Object.keys(store.categoryBreakdown).length"
           class="text-center text-slate-400 text-sm py-4">No expense data yet.</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import * as d3 from 'd3'
import { useFinanceStore } from '../stores/finance'

const store    = useFinanceStore()
const donutRef = ref(null)
const barRef   = ref(null)

const catColors = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#84cc16','#ec4899']

const maxCat = computed(() => Math.max(...Object.values(store.categoryBreakdown), 1))

function fmt(amount) {
  return '$' + Math.abs(Number(amount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

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

  g.selectAll('path').data(pie(data)).join('path')
    .attr('d', arc).attr('fill', d => color(d.data[0])).attr('opacity', 0.85)

  g.append('text').attr('text-anchor', 'middle').attr('dy', '-0.2em')
    .style('font-size', '10px').style('fill', '#94a3b8').text('TOTAL')
  g.append('text').attr('text-anchor', 'middle').attr('dy', '1.1em')
    .style('font-size', '14px').style('font-weight', '700').style('fill', '#0f172a')
    .text(fmt(store.totalSpend))
}

function drawBar() {
  if (!barRef.value) return
  d3.select(barRef.value).selectAll('*').remove()

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
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

  g.selectAll('.grid').data(y.ticks(4)).join('line')
    .attr('x1', 0).attr('x2', w).attr('y1', d => y(d)).attr('y2', d => y(d))
    .attr('stroke', '#e2e8f0')

  g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).tickSize(0))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('text').style('fill', '#94a3b8').style('font-size', '11px').attr('dy', '1.2em'))

  g.append('g').call(d3.axisLeft(y).ticks(4).tickFormat(d => '$' + d))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('.tick line').remove())
    .call(g => g.selectAll('text').style('fill', '#94a3b8').style('font-size', '10px'))

  g.selectAll('.bar').data(months).join('rect')
    .attr('x', d => x(d.label)).attr('width', x.bandwidth())
    .attr('y', d => y(d.spend)).attr('height', d => h - y(d.spend))
    .attr('rx', 4).attr('fill', (_, i) => i === 5 ? '#2563eb' : '#bfdbfe')
}

function renderCharts() { nextTick(() => { drawDonut(); drawBar() }) }

onMounted(async () => {
  if (!store.transactions.length) await store.fetchTransactions()
  renderCharts()
})

watch(() => store.transactions, renderCharts, { deep: true })
</script>