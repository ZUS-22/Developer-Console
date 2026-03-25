<template>
  <AppLayout active-id="usage">
    <!-- Page Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="font-display text-[22px] font-bold text-white leading-tight">Analytics</h1>
        <p class="text-g3 text-sm mt-1">Monitor API usage, audio minutes, and feature consumption over time.</p>
      </div>
      <!-- Export CSV -->
      <button
        @click="exportCSV"
        class="bg-transparent text-g2 border border-border2 hover:bg-card hover:text-white rounded-rxs px-3 py-[6px] text-xs font-medium inline-flex items-center gap-[5px] transition-colors"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Export CSV
      </button>
    </div>

    <!-- Analytics Tabs -->
    <div class="flex border-b border-border1 mb-6 gap-6">
      <button
        v-for="tab in analyticsTabs"
        :key="tab.id"
        @click="activeAnalyticsTab = tab.id"
        :class="[
          'pb-3 text-sm font-medium transition-colors relative',
          activeAnalyticsTab === tab.id
            ? 'text-white border-b-2 border-white -mb-px'
            : 'text-g4 hover:text-g2'
        ]"
      >{{ tab.label }}</button>
    </div>

    <!-- ── OVERVIEW TAB ── -->
    <template v-if="activeAnalyticsTab === 'overview'">
      <!-- Filter Row -->
      <div class="flex flex-wrap gap-3 items-end mb-5">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-medium text-g4 uppercase tracking-wider">Date Range</label>
          <select
            v-model="filterDateRange"
            class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none appearance-none cursor-pointer transition-colors pr-8"
            :style="selectChevronStyle"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <template v-if="filterDateRange === 'custom'">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-medium text-g4 uppercase tracking-wider">Start Date</label>
            <input v-model="customStartDate" type="date" class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-sm text-g2 outline-none transition-colors"/>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-medium text-g4 uppercase tracking-wider">End Date</label>
            <input v-model="customEndDate" type="date" class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-sm text-g2 outline-none transition-colors"/>
          </div>
        </template>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-medium text-g4 uppercase tracking-wider">Deployment</label>
          <select v-model="filterDeployment" class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-sm text-g2 outline-none appearance-none cursor-pointer transition-colors pr-8" :style="selectChevronStyle">
            <option value="all">All</option>
            <option value="cloud">Cloud</option>
            <option value="self-hosted">Self-Hosted</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-medium text-g4 uppercase tracking-wider">Time Bucket</label>
          <select v-model="filterTimeBucket" class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-sm text-g2 outline-none appearance-none cursor-pointer transition-colors pr-8" :style="selectChevronStyle">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      <!-- Feature Tabs -->
      <div class="flex mb-5">
        <div class="flex items-center gap-1 bg-card2 rounded-rxs p-1">
          <button
            v-for="tab in featureTabs"
            :key="tab.id"
            @click="switchFeatureTab(tab.id)"
            :class="['px-3 py-[5px] rounded-[5px] text-xs font-medium transition-colors', activeFeatureTab === tab.id ? 'bg-card text-white shadow-sm' : 'text-g4 hover:text-g2']"
          >{{ tab.label }}</button>
        </div>
      </div>
      <!-- Line Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div class="bg-card border border-border1 rounded-r p-[18px]">
          <h3 class="text-xs font-medium text-g3 mb-4">{{ chart1Label }}</h3>
          <div class="relative h-56"><canvas ref="chart1Ref"></canvas></div>
        </div>
        <div class="bg-card border border-border1 rounded-r p-[18px]">
          <h3 class="text-xs font-medium text-g3 mb-4">{{ chart2Label }}</h3>
          <div class="relative h-56"><canvas ref="chart2Ref"></canvas></div>
        </div>
      </div>
    </template>

    <!-- ── MODEL USAGE TAB ── -->
    <template v-if="activeAnalyticsTab === 'model-usage'">
      <!-- Two horizontal bar charts -->
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
              :class="['border-b border-border1/50 transition-colors hover:bg-card2/50', i === modelBreakdownData.length - 1 ? 'border-b-0' : '']"
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
    <template v-if="activeAnalyticsTab === 'daily-activity'">
      <div class="bg-card border border-border1 rounded-r p-[18px]">
        <div class="flex items-start justify-between mb-5">
          <h3 class="text-sm font-semibold text-white">Daily stream volume</h3>
          <span class="text-[11px] text-g4 font-mono">total streams per day</span>
        </div>
        <div class="relative h-[420px]"><canvas ref="dailyStreamRef"></canvas></div>
      </div>
    </template>

    <!-- ── ERROR ANALYSIS TAB ── -->
    <template v-if="activeAnalyticsTab === 'error-analysis'">
      <div class="bg-card border border-border1 rounded-r p-[18px] flex flex-col items-center justify-center h-64 gap-3">
        <svg class="w-8 h-8 text-g4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
        </svg>
        <p class="text-g4 text-sm">No error data available for the selected period.</p>
      </div>
    </template>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import AppLayout from '../components/AppLayout.vue'

Chart.register(...registerables)

const selectChevronStyle = {
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
}

// ── Analytics top tabs ──
const analyticsTabs = [
  { id: 'overview',       label: 'Overview' },
  { id: 'model-usage',    label: 'Model Usage' },
  { id: 'daily-activity', label: 'Daily Activity' },
  { id: 'error-analysis', label: 'Error Analysis' },
]
const activeAnalyticsTab = ref('overview')

// ── Overview filters ──
const featureTabs = [
  { id: 'all',    label: 'All Products' },
  { id: 'accent', label: 'Accent Translation' },
  { id: 'noise',  label: 'Noise Cancellation' },
]
const activeFeatureTab = ref('all')
const chart1Label = computed(() => {
  if (activeFeatureTab.value === 'accent') return 'Accent Requests'
  if (activeFeatureTab.value === 'noise')  return 'Noise Requests'
  return 'API Requests'
})
const chart2Label = computed(() => {
  if (activeFeatureTab.value === 'accent') return 'Accent Minutes'
  if (activeFeatureTab.value === 'noise')  return 'Noise Minutes'
  return 'Audio Minutes'
})

const filterDateRange  = ref('30')
const customStartDate  = ref('')
const customEndDate    = ref('')
const filterDeployment = ref('all')
const filterTimeBucket = ref('daily')

// ── Overview chart refs ──
const chart1Ref = ref(null)
const chart2Ref = ref(null)
const chartInstances = ref([null, null])

// ── Model Usage refs ──
const modelUsageRef    = ref(null)
const modelDurationRef = ref(null)
let modelUsageChart    = null
let modelDurationChart = null

// ── Daily Activity ref ──
const dailyStreamRef = ref(null)
let dailyStreamChart = null

// ── Model breakdown static data ──
const modelBreakdownData = [
  { model: 'AGENTIC_VI_G_NC', usage: 23873, success: 100, processing: 100, avgDuration: '29.95s' },
  { model: 'VI_G_NC3.0',      usage: 6762,  success: 100, processing: 100, avgDuration: '1m 3s'  },
  { model: 'AGENTIC_ST_NC',   usage: 5959,  success: 100, processing: 100, avgDuration: '59.34s' },
  { model: 'No Model',        usage: 253,   success: 100, processing: 0,   avgDuration: '53.62s' },
  { model: 'ST_NC3.0',        usage: 81,    success: 100, processing: 100, avgDuration: '30.51s' },
]

// ── Helpers ──
function generateLabels(days) {
  const labels = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
  }
  return labels
}
function randomData(n, min, max) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}
function createGradient(ctx, color) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 220)
  if (color === 'green') {
    gradient.addColorStop(0, 'rgba(74,222,128,0.25)')
    gradient.addColorStop(1, 'rgba(74,222,128,0)')
  } else {
    gradient.addColorStop(0, 'rgba(96,165,250,0.25)')
    gradient.addColorStop(1, 'rgba(96,165,250,0)')
  }
  return gradient
}
function buildChartData(canvas, color, labels, data) {
  const ctx = canvas.getContext('2d')
  const gradient = createGradient(ctx, color)
  return {
    labels,
    datasets: [{
      data,
      borderColor: color === 'green' ? '#4ade80' : '#60a5fa',
      borderWidth: 1.5,
      backgroundColor: gradient,
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointBackgroundColor: color === 'green' ? '#4ade80' : '#60a5fa',
      pointBorderColor: 'transparent',
    }],
  }
}

const baseLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#737373', font: { size: 10 }, maxTicksLimit: 8 }, border: { color: 'rgba(255,255,255,0.06)' } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#737373', font: { size: 10 } }, border: { color: 'rgba(255,255,255,0.06)' } },
  },
}

// ── Overview charts ──
function destroyOverviewCharts() {
  chartInstances.value.forEach(c => { if (c) c.destroy() })
  chartInstances.value = [null, null]
}
function initOverviewCharts() {
  destroyOverviewCharts()
  const days = filterDateRange.value === 'custom' ? 30 : parseInt(filterDateRange.value)
  const labels = generateLabels(days)
  if (chart1Ref.value) {
    chartInstances.value[0] = new Chart(chart1Ref.value, {
      type: 'line',
      data: buildChartData(chart1Ref.value, 'green', labels, randomData(days, 200, 5000)),
      options: baseLineOptions,
    })
  }
  if (chart2Ref.value) {
    chartInstances.value[1] = new Chart(chart2Ref.value, {
      type: 'line',
      data: buildChartData(chart2Ref.value, 'blue', labels, randomData(days, 50, 2000)),
      options: baseLineOptions,
    })
  }
}
function switchFeatureTab(tabId) {
  activeFeatureTab.value = tabId
  setTimeout(initOverviewCharts, 50)
}

// ── Model Usage charts ──
const modelLabels = ['AGENTIC_VI_G_NC', 'VI_G_NC3.0', 'AGENTIC_ST_NC', 'No Model', 'ST_NC3.0']
const modelUsageValues    = [23873, 6762, 5959, 253, 81]
const modelUsageColors    = ['#7c6fcd', '#60a5fa', '#a78bfa', '#f59e0b', '#9ca3af']
const modelDurationValues = [29.95, 63, 59.34, 53.62, 30.51]
const modelDurationColors = ['#7c6fcd', '#60a5fa', '#a78bfa', '#f59e0b', '#9ca3af']

const hBarOptions = (maxVal, unit) => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.parsed.x.toLocaleString()}${unit}`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: {
        color: '#737373',
        font: { size: 10 },
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
})

function initModelUsageCharts() {
  if (modelUsageChart)    { modelUsageChart.destroy();    modelUsageChart = null }
  if (modelDurationChart) { modelDurationChart.destroy(); modelDurationChart = null }

  if (modelUsageRef.value) {
    modelUsageChart = new Chart(modelUsageRef.value, {
      type: 'bar',
      data: {
        labels: modelLabels,
        datasets: [{
          data: modelUsageValues,
          backgroundColor: modelUsageColors,
          borderRadius: 3,
          barThickness: 20,
        }],
      },
      options: hBarOptions(28000, ''),
    })
  }
  if (modelDurationRef.value) {
    modelDurationChart = new Chart(modelDurationRef.value, {
      type: 'bar',
      data: {
        labels: modelLabels,
        datasets: [{
          data: modelDurationValues,
          backgroundColor: modelDurationColors,
          borderRadius: 3,
          barThickness: 20,
        }],
      },
      options: hBarOptions(75, 's'),
    })
  }
}

// ── Daily Activity chart ──
const dailyLabels = ['16/03', '17/03', '18/03', '19/03', '20/03', '24/03', '25/03']
const dailyValues  = [0, 120, 0, 0, 0, 18200, 0]

function initDailyStreamChart() {
  if (dailyStreamChart) { dailyStreamChart.destroy(); dailyStreamChart = null }
  if (!dailyStreamRef.value) return

  dailyStreamChart = new Chart(dailyStreamRef.value, {
    type: 'bar',
    data: {
      labels: dailyLabels,
      datasets: [{
        data: dailyValues,
        backgroundColor: '#7c6fcd',
        borderRadius: 4,
        barThickness: 60,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: (ctx) => ` ${ctx.parsed.y.toLocaleString()} streams` },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#737373', font: { size: 11 } },
          border: { color: 'rgba(255,255,255,0.06)' },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            color: '#737373',
            font: { size: 11 },
            callback: (v) => v >= 1000 ? `${v/1000}k` : v,
          },
          border: { color: 'rgba(255,255,255,0.06)' },
          max: 20000,
        },
      },
    },
  })
}

// ── Tab switch watcher ──
watch(activeAnalyticsTab, (tab) => {
  if (tab === 'overview')       setTimeout(initOverviewCharts, 50)
  if (tab === 'model-usage')    setTimeout(initModelUsageCharts, 50)
  if (tab === 'daily-activity') setTimeout(initDailyStreamChart, 50)
})

watch(filterDateRange, () => { setTimeout(initOverviewCharts, 50) })

// ── Export CSV ──
function exportCSV() {
  const days = filterDateRange.value === 'custom' ? 30 : parseInt(filterDateRange.value)
  const labels = generateLabels(days)
  const rows = [['Date','API Requests','Audio Minutes','Accent Requests','Accent Minutes','Noise Requests','Noise Minutes']]
  labels.forEach(label => {
    rows.push([label, ...Array(6).fill(0).map(() => Math.floor(Math.random() * 4800 + 200))])
  })
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `sanas-usage-${new Date().toISOString().slice(0,10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ── Lifecycle ──
onMounted(() => {
  initOverviewCharts()
})

onBeforeUnmount(() => {
  destroyOverviewCharts()
  if (modelUsageChart)    modelUsageChart.destroy()
  if (modelDurationChart) modelDurationChart.destroy()
  if (dailyStreamChart)   dailyStreamChart.destroy()
})
</script>
