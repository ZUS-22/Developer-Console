<template>
  <header class="h-[52px] border-b border-border1 flex items-center px-6 gap-[14px] sticky top-0 bg-black1/92 backdrop-blur-[12px] z-50 shrink-0">
    <span class="font-display font-semibold text-sm text-white">{{ pageTitle }}</span>
    <div class="ml-auto flex items-center gap-2">
      <div class="flex items-center gap-[5px] bg-card border border-border2 rounded-rxs px-[9px] py-1 text-[11px] font-mono text-g2 cursor-pointer">
        <div class="w-[5px] h-[5px] rounded-full bg-grn env-dot-blink"></div>
        production
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <button
        class="inline-flex items-center gap-[5px] px-3 py-[6px] rounded-rxs text-xs font-medium bg-grn text-black hover:bg-grn2 transition-all duration-[130ms] cursor-pointer"
        @click="router.push('/accounts')"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        Accounts
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route  = useRoute()
const router = useRouter()

const titleMap = {
  '/accounts': 'Accounts',
  '/members':  'Sanas Members',
  '/usage':    'Analytics',
}

const accountSubTitles = {
  'api-keys': 'API Keys',
  'team':     'Team',
  'usage':    'Usage',
}

const pageTitle = computed(() => {
  if (route.path.startsWith('/accounts/')) {
    // e.g. /accounts/ACC001/api-keys → last segment is 'api-keys'
    const segments = route.path.split('/')
    const last = segments[segments.length - 1]
    return accountSubTitles[last] ?? 'Account Detail'
  }
  return titleMap[route.path] ?? 'Dashboard'
})
</script>
