<template>
  <aside class="w-[220px] shrink-0 bg-black2 border-r border-border1 flex flex-col fixed top-0 left-0 bottom-0 z-[100] overflow-hidden" aria-label="Account navigation">

    <!-- Back nav -->
    <div class="px-3 pt-3.5 pb-3">
      <button
        @click="router.push('/accounts')"
        class="flex items-center gap-1.5 text-[10px] font-mono text-g5 hover:text-g3 transition-colors tracking-[0.07em] uppercase"
      >
        <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        All Accounts
      </button>
    </div>

    <!-- Account Identity -->
    <div class="px-3 pb-4 border-b border-border1">
      <div class="flex items-center gap-3">
        <!-- Monogram avatar -->
        <div class="w-10 h-10 rounded-[8px] bg-grn/10 border border-grn/20 flex items-center justify-center shrink-0">
          <span class="text-[14px] font-black text-grn tracking-tight leading-none select-none">{{ initials }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-[14px] font-bold text-white leading-snug truncate">{{ accountName }}</div>
          <div class="text-[9.5px] font-mono text-g5 mt-0.5 truncate">{{ accountId }}</div>
        </div>
      </div>
    </div>

    <!-- Scrollable content -->
    <div class="flex-1 overflow-y-auto px-2.5 py-3">
      <div class="flex items-center justify-between px-2 mb-2">
        <span class="text-[9.5px] font-mono text-g5 tracking-[0.08em] uppercase">Groups</span>
        <span v-if="groups.length" class="text-[9px] font-mono text-g5 tabular-nums">{{ totalCount }}</span>
      </div>
      <template v-if="groups.length">
        <GroupTreeNode
          v-for="root in groups"
          :key="root.id"
          :node="root"
          :selected-id="selectedGroupId"
          @select="onGroupSelect"
        />
      </template>
      <div v-else class="text-[11px] text-g5 px-2">No groups</div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import GroupTreeNode from './GroupTreeNode.vue'
import { mockGroups } from '../data/mockGroups.js'

const router = useRouter()

const props = defineProps({
  accountId:   { type: String, required: true },
  accountName: { type: String, default: 'Account' },
})
const emit = defineEmits(['groupSelect'])

const groups = mockGroups

const selectedGroupId = ref(groups[0]?.id ?? '')

const initials = computed(() =>
  props.accountName
    .split(/[\s_-]+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('') || props.accountName.slice(0, 2).toUpperCase()
)

function countNodes(nodes) {
  return nodes.reduce((acc, n) => acc + 1 + countNodes(n.children || []), 0)
}
const totalCount = computed(() => countNodes(groups))

function onGroupSelect(id) {
  selectedGroupId.value = id
  emit('groupSelect', id)
}
</script>
