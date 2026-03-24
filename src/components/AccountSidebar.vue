<template>
  <aside class="w-[220px] shrink-0 bg-black2 border-r border-border1 flex flex-col fixed top-0 left-0 bottom-0 z-[100] overflow-hidden">

    <!-- Back to Accounts -->
    <div class="px-3 pt-4 pb-3 border-b border-border1">
      <button
        @click="router.push('/accounts')"
        class="flex items-center gap-1.5 text-[11px] text-g4 hover:text-g2 transition-colors"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        All Accounts
      </button>
      <div class="mt-2.5 flex items-center gap-2">
        <div class="w-5 h-5 rounded bg-grn/20 flex items-center justify-center shrink-0">
          <svg class="w-3 h-3 text-grn" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </div>
        <span class="text-[12.5px] font-semibold text-white truncate">{{ accountName }}</span>
      </div>
    </div>

    <!-- Scrollable content -->
    <div class="flex-1 overflow-y-auto px-2.5 py-3">
      <div class="text-[9.5px] font-mono text-g5 tracking-[0.08em] uppercase px-2 mb-[5px]">Groups</div>
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
import { ref } from 'vue'
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

function onGroupSelect(id) {
  selectedGroupId.value = id
  emit('groupSelect', id)
}
</script>
