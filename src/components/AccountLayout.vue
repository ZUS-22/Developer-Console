<template>
  <div class="flex min-h-screen bg-black1 text-white font-body">
    <AccountSidebar
      :account-id="accountId"
      :account-name="accountName"
      @group-select="selectedGroupId = $event"
    />
    <div class="flex flex-col flex-1 min-w-0 ml-[220px]">
      <AppHeader />

      <!-- Tab nav bar -->
      <div class="border-b border-border1 px-6 flex items-center gap-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="navigateTo(tab.id)"
          :class="[
            'px-3 py-3 text-[12.5px] font-medium border-b-2 transition-colors duration-[130ms] -mb-px',
            activeNav === tab.id
              ? 'text-white border-grn'
              : 'text-g4 border-transparent hover:text-g2',
          ]"
        >{{ tab.label }}</button>
      </div>

      <main class="flex-1 p-6 fade-in">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AccountSidebar from './AccountSidebar.vue'
import AppHeader from './AppHeader.vue'
import { mockGroups } from '../data/mockGroups.js'

const props = defineProps({
  accountId:   { type: String, required: true },
  accountName: { type: String, default: 'Account' },
  activeNav:   { type: String, default: 'dashboard' },
})

const route  = useRoute()
const router = useRouter()

const initialGroupId = mockGroups[0]?.id ?? ''
const selectedGroupId = ref(initialGroupId)
provide('selectedGroupId', selectedGroupId)

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'api-keys',  label: 'API Keys'  },
  { id: 'team',      label: 'Team'      },
  { id: 'usage',     label: 'Usage'     },
]

function navigateTo(tabId) {
  const name = route.query.name ? `?name=${encodeURIComponent(route.query.name)}` : ''
  const routeMap = {
    dashboard:  `/accounts/${props.accountId}`,
    'api-keys': `/accounts/${props.accountId}/api-keys`,
    team:       `/accounts/${props.accountId}/team`,
    usage:      `/accounts/${props.accountId}/usage`,
  }
  if (routeMap[tabId]) router.push(routeMap[tabId] + name)
}
</script>
