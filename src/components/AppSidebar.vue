<template>
  <aside class="w-[220px] shrink-0 bg-black2 border-r border-border1 flex flex-col fixed top-0 left-0 bottom-0 z-[100] overflow-hidden">
    <!-- Logo -->
    <div class="flex items-center gap-2.5 px-4 py-5 border-b border-border1">
      <div class="h-[100px] flex items-center justify-center shrink-0">
        <img src="../assets/logo.png" alt="Sanas" />
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-2.5 py-3 overflow-y-auto">
      <div v-for="section in sections" :key="section.label" class="mb-[22px]">
        <div class="text-[9.5px] font-mono text-g5 tracking-[0.08em] uppercase px-2 mb-[5px]">{{ section.label }}</div>
        <div
          v-for="item in section.items"
          :key="item.id"
          :class="[
            'flex items-center gap-[9px] px-[9px] py-[7px] rounded-rxs cursor-pointer text-[12.5px] transition-all duration-[130ms] border select-none',
            activeId === item.id
              ? 'text-white bg-grn/10 border-grn/[0.13]'
              : 'text-g3 border-transparent hover:text-white hover:bg-card'
          ]"
          @click="$emit('select', item.id)"
        >
          <svg
            :class="['w-[14px] h-[14px] shrink-0', activeId === item.id ? 'text-grn opacity-100' : 'opacity-55']"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
            v-html="item.icon"
          ></svg>
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="ml-auto text-[9px] font-mono bg-grn/10 text-grn rounded-full px-[5px] py-[1px]">{{ item.badge }}</span>
        </div>
      </div>
    </nav>

    <!-- User footer -->
    <div class="px-2.5 py-3 border-t border-border1">
      <div class="flex items-center gap-[9px] px-[9px] py-[7px] rounded-rxs cursor-pointer hover:bg-card transition-all duration-[130ms]">
        <div class="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-grn to-grn3 flex items-center justify-center text-[10px] font-semibold text-black shrink-0">ZU</div>
        <div>
          <div class="text-xs font-medium text-white">Zupudi U.</div>
          <div class="text-[10px] text-g4">Admin</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({ activeId: { type: String, default: 'accounts' } })
defineEmits(['select'])

const sections = [
  {
    label: 'Overview',
    items: [
      { id: 'accounts', label: 'Accounts',       icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>' },
      { id: 'usage',    label: 'Analytics',       icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
    ],
  },
  {
    label: 'Team',
    items: [
      { id: 'members',  label: 'Sanas Members',   icon: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>' },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'settings', label: 'Settings',         icon: '<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>' },
    ],
  },
]
</script>
