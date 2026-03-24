<template>
  <AccountLayout
    :account-id="accountId"
    :account-name="accountName"
    active-nav="api-keys"
  >
    <!-- Page Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="font-display text-[22px] font-bold text-white leading-tight">API Keys</h1>
        <p class="text-g3 text-sm mt-1">Manage API keys for your groups and deployments.</p>
      </div>
      <button
        @click="showCreateForm = true"
        class="bg-grn text-black hover:bg-grn/90 rounded-rxs px-3 py-[6px] text-xs font-medium inline-flex items-center gap-[5px] transition-colors"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Create Key
      </button>
    </div>

    <!-- Create form -->
    <div v-if="showCreateForm" class="bg-card border border-border1 rounded-r p-4 mb-5">
      <div class="mb-3">
        <label class="block text-xs font-medium text-g3 mb-1.5">Key Name</label>
        <input v-model="newKeyName" type="text" placeholder="e.g., Production Key"
          class="w-full px-3 py-2 bg-card2 border border-border2 rounded-rxs text-sm text-white placeholder-g5 focus:border-grn/40 outline-none transition-colors" />
      </div>
      <div class="mb-4">
        <label class="block text-xs font-medium text-g3 mb-1.5">Expiry Date <span class="text-g5">(optional)</span></label>
        <input v-model="newKeyExpiry" type="date"
          class="w-full px-3 py-2 bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none transition-colors" />
      </div>
      <div class="flex gap-2">
        <button @click="showCreateForm = false; newKeyName = ''; newKeyExpiry = ''"
          class="bg-transparent text-g2 border border-border2 hover:bg-card hover:text-white rounded-rxs px-3 py-[6px] text-xs font-medium transition-colors">Cancel</button>
        <button @click="createKey"
          class="bg-grn text-black hover:bg-grn/90 rounded-rxs px-3 py-[6px] text-xs font-medium transition-colors">Create Key</button>
      </div>
    </div>

    <!-- Keys table -->
    <div class="bg-card border border-border1 rounded-r overflow-hidden">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-border1">
            <th class="text-left px-4 py-3 text-[10px] font-mono text-g4 uppercase tracking-wider">Name</th>
            <th class="text-left px-4 py-3 text-[10px] font-mono text-g4 uppercase tracking-wider">Key</th>
            <th class="text-left px-4 py-3 text-[10px] font-mono text-g4 uppercase tracking-wider">Created</th>
            <th class="text-left px-4 py-3 text-[10px] font-mono text-g4 uppercase tracking-wider">Expires</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="key in keys" :key="key.id" class="border-b border-border1 last:border-0 hover:bg-card2 transition-colors">
            <td class="px-4 py-3 text-sm text-white font-medium">{{ key.name }}</td>
            <td class="px-4 py-3 font-mono text-[11px] text-g3">{{ key.revealed ? key.fullKey : key.maskedKey }}</td>
            <td class="px-4 py-3 text-xs text-g4">{{ key.createdAt }}</td>
            <td class="px-4 py-3 text-xs text-g4">{{ key.expiry || '—' }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button @click="key.revealed = !key.revealed"
                  class="bg-transparent text-g3 border border-border2 hover:bg-card2 hover:text-white rounded-rxs px-2 py-1 text-xs transition-colors">
                  {{ key.revealed ? 'Hide' : 'Show' }}
                </button>
                <button @click="deleteKey(key.id)"
                  class="bg-transparent text-red1/70 border border-red1/20 hover:bg-red1/10 hover:text-red1 rounded-rxs px-2 py-1 text-xs transition-colors">
                  Delete
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="keys.length === 0">
            <td colspan="5" class="px-4 py-10 text-center text-g5 text-sm">No API keys yet.</td>
          </tr>
        </tbody>
      </table>
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

const showCreateForm = ref(false)
const newKeyName     = ref('')
const newKeyExpiry   = ref('')

const keys = ref([
  { id: 1, name: 'Production Key', fullKey: 'sanas-live-Kf9mNpQ2xRsT5vWyZ8aB3cD6eF1g', maskedKey: 'sanas-live-Kf9m...F1g', createdAt: '2026-01-10', expiry: '2026-12-31', revealed: false },
  { id: 2, name: 'Staging Key',    fullKey: 'sanas-test-Mn3pQr7sT9uVwXyZ2aB5cD8eF0gH', maskedKey: 'sanas-test-Mn3p...0gH', createdAt: '2026-02-05', expiry: '2026-06-30', revealed: false },
])
let nextId = 3

function createKey() {
  if (!newKeyName.value.trim()) return
  const prefix  = newKeyName.value.toLowerCase().includes('prod') ? 'sanas-live' : 'sanas-test'
  const chars   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let raw = prefix + '_'
  for (let i = 0; i < 24; i++) raw += chars[Math.floor(Math.random() * chars.length)]
  keys.value.push({
    id: nextId++,
    name: newKeyName.value.trim(),
    fullKey: raw,
    maskedKey: raw.slice(0, 12) + '...' + raw.slice(-3),
    createdAt: new Date().toISOString().slice(0, 10),
    expiry: newKeyExpiry.value || null,
    revealed: false,
  })
  showCreateForm.value = false
  newKeyName.value = ''
  newKeyExpiry.value = ''
}

function deleteKey(id) {
  keys.value = keys.value.filter(k => k.id !== id)
}
</script>
