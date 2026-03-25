<template>
  <AccountLayout
    :account-id="accountId"
    :account-name="accountName"
    active-nav="usage"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="font-display text-[22px] font-bold text-white leading-tight">Usage</h1>
        <p class="text-g3 text-sm mt-1">API call counts and latency metrics for this account.</p>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div v-for="stat in stats" :key="stat.label" class="bg-card border border-border1 rounded-r p-4">
        <div class="text-[10px] font-mono text-g4 uppercase tracking-wider mb-2">{{ stat.label }}</div>
        <div class="text-2xl font-display font-bold text-white">{{ stat.value }}</div>
        <div class="text-xs text-g4 mt-1">{{ stat.sub }}</div>
      </div>
    </div>

    <!-- Analytics Tabs -->
    <div class="flex border-b border-border1 mb-6 gap-6">
      <button
        v-for="tab in analyticsTabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'pb-3 text-sm font-medium transition-colors',
          activeTab === tab.id
            ? 'text-white border-b-2 border-white -mb-px'
            : 'text-g4 hover:text-g2'
        ]"
      >{{ tab.label }}</button>
    </div>

    <!-- ── OVERVIEW TAB ── -->
    <template v-if="activeTab === 'overview'">
      <div class="flex items-center gap-3 mb-5">
        <select v-model="range"
          class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-sm text-g2 outline-none appearance-none cursor-pointer transition-colors"
          :style="selectChevronStyle">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>
      <div class="bg-card border border-border1 rounded-r p-5">
        <div class="text-sm font-semibold text-white mb-1">API Calls Over Time</div>
        <div class="text-xs text-g4 mb-4">Daily call volume for selected period</div>
        <div class="h-40 flex items-end gap-1">
          <div
            v-for="(bar, i) in bars"
            :key="i"
            :style="{ height: bar + '%' }"
            class="flex-1 bg-grn/30 rounded-t-sm hover:bg-grn/50 transition-colors"
          />
        </div>
      </div>
    </template>

    <!-- ── MODEL USAGE TAB ── -->
    <template v-if="activeTab === 'model-usage'">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <!-- Usage by model -->
        <div class="bg-card border border-border1 rounded-r p-[18px]">
          <div class="flex items-start justify-between mb-5">
            <h3 class="text-sm font-semibold text-white">Usage by model</h3>
            <span class="text-[11px] text-g4 font-mono">total streams</span>
          </div>
          <div class="relative h-64"><canvas ref="modelUsageRef"></canvas></div>
        </div>
        <!-- Avg duration by model -->
        <div class="bg-card border border-border1 rounded-r p-[18px]">
          <div class="flex items-start justify-between mb-5">
            <h3 class="text-sm font-semibold text-white">Avg duration by model</h3>
            <span class="text-[11px] text-g4 font-mono">seconds</span>
          </div>
          <div class="relative h-64"><canvas ref="modelDurationRef"></canvas></div>
        </div>
      </div>

      <!-- Model breakdown table -->
      <div class="bg-card border border-border1 rounded-r p-[18px]">
        <div class="flex items-start justify-between mb-5">
          <h3 class="text-sm font-semibold text-white">Model breakdown</h3>
          <span class="text-[11px] text-g4 font-mono">all metrics</span>
        </div>
        <table class="w-full">
          <thead>
            <tr class="border-b border-border1">
              <th class="text-left text-[10px] font-medium text-g4 uppercase tracking-wider pb-3 pr-4">Model</th>
              <th class="text-right text-[10px] font-medium text-g4 uppercase tracking-wider pb-3 px-4">Usage</th>
              <th class="text-center text-[10px] font-medium text-g4 uppercase tracking-wider pb-3 px-4">Success</th>
              <th class="text-center text-[10px] font-medium text-g4 uppercase tracking-wider pb-3 px-4">Processing</th>
              <th class="text-right text-[10px] font-medium text-g4 uppercase tracking-wider pb-3 pl-4">Avg Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, i) in modelBreakdownData"
              :key="row.model"
              :class="['border-b border-border1/50 hover:bg-card2/50 transition-colors', i === modelBreakdownData.length - 1 ? 'border-b-0' : '']"
            >
              <td class="py-4 pr-4 text-sm font-medium text-white">{{ row.model }}</td>
              <td class="py-4 px-4 text-sm text-g3 text-right tabular-nums">{{ row.usage.toLocaleString() }}</td>
              <td class="py-4 px-4 text-center">
                <span :class="['inline-flex items-center justify-center px-2 py-[2px] rounded text-[11px] font-bold', row.success === 100 ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400']">
                  {{ row.success }}%
                </span>
              </td>
              <td class="py-4 px-4 text-center">
                <span :class="['inline-flex items-center justify-center px-2 py-[2px] rounded text-[11px] font-bold', row.processing === 100 ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400']">
                  {{ row.processing }}%
                </span>
              </td>
              <td class="py-4 pl-4 text-sm text-g3 text-right tabular-nums">{{ row.avgDuration }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- ── DAILY ACTIVITY TAB ── -->
    <template v-if="activeTab === 'daily-activity'">
      <div class="bg-card border border-border1 rounded-r p-[18px]">
        <div class="flex items-start justify-between mb-5">
          <h3 class="text-sm font-semibold text-white">Daily stream volume</h3>
          <span class="text-[11px] text-g4 font-mono">total streams per day</span>
        </div>
        <div class="relative h-[420px]"><canvas ref="dailyStreamRef"></canvas></div>
      </div>
    </template>

    <!-- ── ERROR ANALYSIS TAB ── -->
    <template v-if="activeTab === 'error-analysis'">
      <div class="bg-card border border-border1 rounded-r p-[18px] flex flex-col items-center justify-center h-64 gap-3">
        <svg class="w-8 h-8 text-g4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
        </svg>
        <p class="text-g4 text-sm">No error data available for the selected period.</p>
      </div>
    </template>
  </AccountLayout>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { Chart, registerables } from 'chart.js'
import AccountLayout from '../components/AccountLayout.vue'

Chart.register(...registerables)

const route = useRoute()
const accountId   = computed(() => route.params.id || 'ACC001')
const accountName = computed(() => route.query.name || 'Account')
const range       = ref('30')

const stats = [
  { label: 'Total API Calls', value: '124,830', sub: 'vs 98,200 prior period' },
  { label: 'Avg Latency',     value: '42 ms',   sub: 'p50 response time' },
  { label: 'Active Keys',     value: '7',        sub: 'across all groups' },
]

const bars = Array.from({ length: 30 }, (_, i) => 20 + ((i * 37 + 11) % 65))

const selectChevronStyle = {
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
}

// ── Tabs ──
const analyticsTabs = [
  { id: 'overview',       label: 'Overview' },
  { id: 'model-usage',    label: 'Model Usage' },
  { id: 'daily-activity', label: 'Daily Activity' },
  { id: 'error-analysis', label: 'Error Analysis' },
]
const activeTab = ref('overview')

// ── Model Usage ──
const modelUsageRef    = ref(null)
const modelDurationRef = ref(null)
let modelUsageChart    = null
let modelDurationChart = null

const modelLabels         = ['AGENTIC_VI_G_NC', 'VI_G_NC3.0', 'AGENTIC_ST_NC', 'No Model', 'ST_NC3.0']
const modelUsageValues    = [23873, 6762, 5959, 253, 81]
const modelDurationValues = [29.95, 63, 59.34, 53.62, 30.51]
const modelColors         = ['#7c6fcd', '#60a5fa', '#a78bfa', '#f59e0b', '#9ca3af']

const modelBreakdownData = [
  { model: 'AGENTIC_VI_G_NC', usage: 23873, success: 100, processing: 100, avgDuration: '29.95s' },
  { model: 'VI_G_NC3.0',      usage: 6762,  success: 100, processing: 100, avgDuration: '1m 3s'  },
  { model: 'AGENTIC_ST_NC',   usage: 5959,  success: 100, processing: 100, avgDuration: '59.34s' },
  { model: 'No Model',        usage: 253,   success: 100, processing: 0,   avgDuration: '53.62s' },
  { model: 'ST_NC3.0',        usage: 81,    success: 100, processing: 100, avgDuration: '30.51s' },
]

function hBarOptions(maxVal, unit) {
  return {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.x.toLocaleString()}${unit}` } },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: {
          color: '#737373', font: { size: 10 },
          callback: (v) => unit === 's' ? `${v}${unit}` : (v >= 1000 ? `${v/1000}k` : v),
        },
        border: { color: 'rgba(255,255,255,0.06)' },
        max: maxVal,
      },
      y: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { size: 10 } },
        border: { color: 'rgba(255,255,255,0.06)' },
      },
    },
  }
}

function initModelUsageCharts() {
  if (modelUsageChart)    { modelUsageChart.destroy();    modelUsageChart = null }
  if (modelDurationChart) { modelDurationChart.destroy(); modelDurationChart = null }
  if (modelUsageRef.value) {
    modelUsageChart = new Chart(modelUsageRef.value, {
      type: 'bar',
      data: { labels: modelLabels, datasets: [{ data: modelUsageValues, backgroundColor: modelColors, borderRadius: 3, barThickness: 20 }] },
      options: hBarOptions(28000, ''),
    })
  }
  if (modelDurationRef.value) {
    modelDurationChart = new Chart(modelDurationRef.value, {
      type: 'bar',
      data: { labels: modelLabels, datasets: [{ data: modelDurationValues, backgroundColor: modelColors, borderRadius: 3, barThickness: 20 }] },
      options: hBarOptions(75, 's'),
    })
  }
}

// ── Daily Activity ──
const dailyStreamRef = ref(null)
let dailyStreamChart = null

function initDailyStreamChart() {
  if (dailyStreamChart) { dailyStreamChart.destroy(); dailyStreamChart = null }
  if (!dailyStreamRef.value) return
  dailyStreamChart = new Chart(dailyStreamRef.value, {
    type: 'bar',
    data: {
      labels: ['16/03', '17/03', '18/03', '19/03', '20/03', '24/03', '25/03'],
      datasets: [{ data: [0, 120, 0, 0, 0, 18200, 0], backgroundColor: '#7c6fcd', borderRadius: 4, barThickness: 60 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.y.toLocaleString()} streams` } },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#737373', font: { size: 11 } },
          border: { color: 'rgba(255,255,255,0.06)' },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#737373', font: { size: 11 }, callback: (v) => v >= 1000 ? `${v/1000}k` : v },
          border: { color: 'rgba(255,255,255,0.06)' },
          max: 20000,
        },
      },
    },
  })
}

// ── Tab watcher ──
watch(activeTab, (tab) => {
  if (tab === 'model-usage')    setTimeout(initModelUsageCharts, 50)
  if (tab === 'daily-activity') setTimeout(initDailyStreamChart, 50)
})

onBeforeUnmount(() => {
  if (modelUsageChart)    modelUsageChart.destroy()
  if (modelDurationChart) modelDurationChart.destroy()
  if (dailyStreamChart)   dailyStreamChart.destroy()
})
</script>
