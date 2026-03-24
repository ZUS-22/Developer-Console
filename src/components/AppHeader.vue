<template>
  <header class="h-[52px] border-b border-border1 flex items-center px-6 gap-[14px] sticky top-0 bg-black1/92 backdrop-blur-[12px] z-50 shrink-0">
    <span class="font-display font-semibold text-sm text-white">{{ pageTitle }}</span>
    <div class="ml-auto flex items-center gap-2">
      <button
        class="inline-flex items-center gap-[5px] px-3 py-[6px] rounded-rxs text-xs font-medium bg-transparent text-g2 border border-border2 hover:bg-card hover:text-white transition-all duration-[130ms] cursor-pointer"
        @click="router.push('/docs')"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        Docs
      </button>
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
  '/docs':     'Documentation',
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
