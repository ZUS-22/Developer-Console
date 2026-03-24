<template>
  <div class="flex min-h-screen bg-black1 text-white font-body">
    <AppSidebar :active-id="activeId" @select="navigate" />
    <div class="flex flex-col flex-1 min-w-0 ml-[220px]">
      <AppHeader />
      <main class="flex-1 p-6 fade-in">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppHeader  from './AppHeader.vue'

defineProps({ activeId: { type: String, default: 'accounts' } })

const router = useRouter()
const routes = {
  accounts: '/accounts',
  usage:    '/usage',
  'api-keys': '/api-keys',
  users:    '/users',
  members:  '/members',
  settings: '/settings',
}

function navigate(id) {
  if (routes[id]) router.push(routes[id])
}
</script>
