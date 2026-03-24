<template>
  <AccountLayout
    :account-id="accountId"
    :account-name="accountName"
    active-nav="usage"
  >
    <!-- Header -->
    <div class="mb-6">
      <h1 class="font-display text-[22px] font-bold text-white leading-tight">Usage</h1>
      <p class="text-g3 text-sm mt-1">API call counts and latency metrics for this account.</p>
    </div>

    <!-- Date range filter -->
    <div class="flex items-center gap-3 mb-6">
      <select v-model="range"
        class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none appearance-none cursor-pointer transition-colors">
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
      </select>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div v-for="stat in stats" :key="stat.label" class="bg-card border border-border1 rounded-r p-4">
        <div class="text-[10px] font-mono text-g4 uppercase tracking-wider mb-2">{{ stat.label }}</div>
        <div class="text-2xl font-display font-bold text-white">{{ stat.value }}</div>
        <div class="text-xs text-g4 mt-1">{{ stat.sub }}</div>
      </div>
    </div>

    <!-- Chart placeholder -->
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
  </AccountLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AccountLayout from '../components/AccountLayout.vue'

const route = useRoute()
const accountId   = computed(() => route.params.id || 'ACC001')
const accountName = computed(() => route.query.name || 'Account')
const range       = ref('30')

const stats = [
  { label: 'Total API Calls', value: '124,830', sub: 'vs 98,200 prior period' },
  { label: 'Avg Latency',     value: '42 ms',   sub: 'p50 response time' },
  { label: 'Active Keys',     value: '7',        sub: 'across all groups' },
]

// Deterministic mock bar heights
const bars = Array.from({ length: 30 }, (_, i) => 20 + ((i * 37 + 11) % 65))
</script>
