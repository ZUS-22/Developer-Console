<template>
  <header class="h-[52px] border-b border-border1 flex items-center px-6 gap-[14px] sticky top-0 bg-black1/92 backdrop-blur-[12px] z-50 shrink-0">
    <span class="font-display font-semibold text-sm text-g1">{{ pageTitle }}</span>
    <div class="ml-auto flex items-center gap-2">
      <button
        @click="toggleTheme"
        class="inline-flex items-center justify-center w-[30px] h-[30px] rounded-rxs text-g3 border border-border2 hover:bg-card hover:text-g1 transition-all duration-[130ms] cursor-pointer"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <!-- Sun (shown in dark mode — click to go light) -->
        <svg v-if="isDark" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <!-- Moon (shown in light mode — click to go dark) -->
        <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      </button>
      <button
        class="inline-flex items-center gap-[5px] px-3 py-[6px] rounded-rxs text-xs font-medium bg-transparent text-g2 border border-border2 hover:bg-card hover:text-g1 transition-all duration-[130ms] cursor-pointer"
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
import { useTheme } from '../composables/useTheme.js'

const route  = useRoute()
const router = useRouter()
const { isDark, toggle: toggleTheme } = useTheme()

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
