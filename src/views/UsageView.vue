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

    <!-- Filter Row -->
    <div class="flex flex-wrap gap-3 items-end mb-5">
      <!-- Date range -->
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

      <!-- Custom date inputs -->
      <template v-if="filterDateRange === 'custom'">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-medium text-g4 uppercase tracking-wider">Start Date</label>
          <input
            v-model="customStartDate"
            type="date"
            class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none transition-colors"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-medium text-g4 uppercase tracking-wider">End Date</label>
          <input
            v-model="customEndDate"
            type="date"
            class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none transition-colors"
          />
        </div>
      </template>

      <!-- Deployment -->
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-medium text-g4 uppercase tracking-wider">Deployment</label>
        <select
          v-model="filterDeployment"
          class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none appearance-none cursor-pointer transition-colors pr-8"
          :style="selectChevronStyle"
        >
          <option value="all">All</option>
          <option value="cloud">Cloud</option>
          <option value="self-hosted">Self-Hosted</option>
        </select>
      </div>

      <!-- Time bucket -->
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-medium text-g4 uppercase tracking-wider">Time Bucket</label>
        <select
          v-model="filterTimeBucket"
          class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none appearance-none cursor-pointer transition-colors pr-8"
          :style="selectChevronStyle"
        >
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
          :class="[
            'px-3 py-[5px] rounded-[5px] text-xs font-medium transition-colors',
            activeFeatureTab === tab.id
              ? 'bg-card text-white shadow-sm'
              : 'text-g4 hover:text-g2'
          ]"
        >{{ tab.label }}</button>
      </div>
    </div>

    <!-- Charts grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <!-- Chart 1 -->
      <div class="bg-card border border-border1 rounded-r p-[18px]">
        <h3 class="text-xs font-medium text-g3 mb-4">{{ chart1Label }}</h3>
        <div class="relative h-56">
          <canvas ref="chart1Ref"></canvas>
        </div>
      </div>

      <!-- Chart 2 -->
      <div class="bg-card border border-border1 rounded-r p-[18px]">
        <h3 class="text-xs font-medium text-g3 mb-4">{{ chart2Label }}</h3>
        <div class="relative h-56">
          <canvas ref="chart2Ref"></canvas>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import AppLayout from '../components/AppLayout.vue'

Chart.register(...registerables)

// Chevron style for selects
const selectChevronStyle = {
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
}

// ---- Feature tabs ----
const featureTabs = [
  { id: 'all', label: 'All Products' },
  { id: 'accent', label: 'Accent Translation' },
  { id: 'noise', label: 'Noise Cancellation' },
]

const activeFeatureTab = ref('all')

const chart1Label = computed(() => {
  if (activeFeatureTab.value === 'accent') return 'Accent Requests'
  if (activeFeatureTab.value === 'noise') return 'Noise Requests'
  return 'API Requests'
})

const chart2Label = computed(() => {
  if (activeFeatureTab.value === 'accent') return 'Accent Minutes'
  if (activeFeatureTab.value === 'noise') return 'Noise Minutes'
  return 'Audio Minutes'
})

// ---- Filters ----
const filterDateRange = ref('30')
const customStartDate = ref('')
const customEndDate = ref('')
const filterDeployment = ref('all')
const filterTimeBucket = ref('daily')

// ---- Chart refs ----
const chart1Ref = ref(null)
const chart2Ref = ref(null)
const chartInstances = ref([null, null])

// ---- Data generation ----
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
    datasets: [
      {
        data,
        borderColor: color === 'green' ? '#4ade80' : '#60a5fa',
        borderWidth: 1.5,
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointBackgroundColor: color === 'green' ? '#4ade80' : '#60a5fa',
        pointBorderColor: 'transparent',
      },
    ],
  }
}

const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: '#737373', font: { size: 10 }, maxTicksLimit: 8 },
      border: { color: 'rgba(255,255,255,0.06)' },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: '#737373', font: { size: 10 } },
      border: { color: 'rgba(255,255,255,0.06)' },
    },
  },
}

function destroyCharts() {
  chartInstances.value.forEach((c) => {
    if (c) c.destroy()
  })
  chartInstances.value = [null, null]
}

function initCharts() {
  destroyCharts()

  const days = filterDateRange.value === 'custom' ? 30 : parseInt(filterDateRange.value)
  const labels = generateLabels(days)

  if (chart1Ref.value) {
    const data1 = randomData(days, 200, 5000)
    chartInstances.value[0] = new Chart(chart1Ref.value, {
      type: 'line',
      data: buildChartData(chart1Ref.value, 'green', labels, data1),
      options: baseChartOptions,
    })
  }

  if (chart2Ref.value) {
    const data2 = randomData(days, 50, 2000)
    chartInstances.value[1] = new Chart(chart2Ref.value, {
      type: 'line',
      data: buildChartData(chart2Ref.value, 'blue', labels, data2),
      options: baseChartOptions,
    })
  }
}

function switchFeatureTab(tabId) {
  activeFeatureTab.value = tabId
  setTimeout(initCharts, 50)
}

// ---- Export CSV ----
function exportCSV() {
  const days = filterDateRange.value === 'custom' ? 30 : parseInt(filterDateRange.value)
  const labels = generateLabels(days)

  const rows = [
    ['Date', 'API Requests', 'Audio Minutes', 'Accent Requests', 'Accent Minutes', 'Noise Requests', 'Noise Minutes'],
  ]

  labels.forEach((label) => {
    rows.push([
      label,
      Math.floor(Math.random() * 4800 + 200),
      Math.floor(Math.random() * 1950 + 50),
      Math.floor(Math.random() * 2500 + 100),
      Math.floor(Math.random() * 1000 + 30),
      Math.floor(Math.random() * 2300 + 100),
      Math.floor(Math.random() * 900 + 20),
    ])
  })

  const csvContent = rows.map((r) => r.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `sanas-usage-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ---- Lifecycle ----
onMounted(() => {
  initCharts()
})

onBeforeUnmount(() => {
  destroyCharts()
})

watch(filterDateRange, () => {
  setTimeout(initCharts, 50)
})
</script>
