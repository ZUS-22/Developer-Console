<template>
  <AppLayout active-id="api-keys">
    <!-- Breadcrumb -->
    <div class="mb-5">
      <nav class="flex items-center gap-1.5 text-[11px] font-mono text-g4">
        <RouterLink to="/accounts" class="hover:text-g2 transition-colors">Sanas</RouterLink>
        <span>›</span>
        <span class="text-g3">Production</span>
      </nav>
    </div>

    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="font-display text-xl font-semibold text-white">API Keys</h1>
      <p class="text-xs text-g3 mt-1">Manage API keys for your groups and deployments.</p>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center justify-between mb-5">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-g4" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search API Keys"
          class="pl-8 pr-3 py-[6px] w-[260px] bg-card2 border border-border2 rounded-rxs text-xs text-g2 placeholder-g5 focus:outline-none focus:border-grn/40 transition-all"
        />
      </div>
      <div class="flex items-center gap-2">
        <select
          v-model="statusFilter"
          class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-xs text-g2 appearance-none cursor-pointer focus:outline-none focus:border-grn/40 transition-all"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expiring">Expiring Soon</option>
          <option value="expired">Expired</option>
        </select>
        <button
          @click="showCreateModal = true"
          class="bg-grn text-black hover:bg-grn2 rounded-rxs px-3 py-[6px] text-xs font-medium uppercase tracking-wide transition-colors"
        >
          Create API Key
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-card border border-border1 rounded-r overflow-hidden">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-border1">
            <th class="text-left px-4 py-3 text-[11px] font-mono font-medium text-g4 uppercase tracking-wider">Name</th>
            <th class="text-left px-4 py-3 text-[11px] font-mono font-medium text-g4 uppercase tracking-wider">Key (Masked)</th>
            <th class="text-left px-4 py-3 text-[11px] font-mono font-medium text-g4 uppercase tracking-wider">Group</th>
            <th class="text-left px-4 py-3 text-[11px] font-mono font-medium text-g4 uppercase tracking-wider">Created At</th>
            <th class="text-left px-4 py-3 text-[11px] font-mono font-medium text-g4 uppercase tracking-wider">Created By</th>
            <th class="text-left px-4 py-3 text-[11px] font-mono font-medium text-g4 uppercase tracking-wider">Expires At</th>
            <th class="text-left px-4 py-3 text-[11px] font-mono font-medium text-g4 uppercase tracking-wider">Status</th>
            <th class="text-left px-4 py-3 text-[11px] font-mono font-medium text-g4 uppercase tracking-wider">Deployment</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="key in filteredKeys"
            :key="key.id"
            class="border-b border-border1 last:border-0 hover:bg-card2 transition-colors"
          >
            <td class="px-4 py-3 text-xs font-medium text-g2">{{ key.name }}</td>
            <td class="px-4 py-3 font-mono text-[11px] text-g4 tracking-tight">{{ key.maskedKey }}</td>
            <td class="px-4 py-3">
              <span class="inline-block px-2 py-0.5 bg-card2 border border-border1 text-g3 text-[11px] rounded-rxs">{{ key.group }}</span>
            </td>
            <td class="px-4 py-3 text-xs text-g3">{{ key.createdAt }}</td>
            <td class="px-4 py-3 text-xs text-g3">{{ key.createdBy }}</td>
            <td class="px-4 py-3 text-xs text-g3">{{ key.expiresAt }}</td>
            <td class="px-4 py-3">
              <StatusBadge :value="key.status" />
            </td>
            <td class="px-4 py-3">
              <StatusBadge :value="key.deployment" />
            </td>
            <td class="px-4 py-3">
              <button
                @click="deleteKey(key.id)"
                class="px-2 py-1 bg-transparent border border-red-800/50 text-red-500 hover:bg-red-950/40 hover:border-red-700 rounded-rxs text-[11px] transition-all"
                title="Delete"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="filteredKeys.length === 0">
            <td colspan="9" class="px-4 py-10 text-center text-g5 text-xs">No API keys found</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex items-center justify-end gap-4 border-t border-border1 px-4 py-3">
        <div class="flex items-center gap-2 text-xs text-g4">
          <span>Rows per page:</span>
          <select class="px-2 py-1 bg-card2 border border-border2 rounded-rxs text-xs text-g2 appearance-none cursor-pointer focus:outline-none">
            <option>10</option><option>25</option><option>50</option>
          </select>
        </div>
        <span class="text-xs text-g4">1–{{ filteredKeys.length }} of {{ filteredKeys.length }}</span>
        <div class="flex gap-1">
          <button class="w-7 h-7 border border-border2 bg-card2 rounded-rxs flex items-center justify-center text-g5 text-xs opacity-40 cursor-not-allowed">&#8249;</button>
          <button class="w-7 h-7 border border-border2 bg-card2 rounded-rxs flex items-center justify-center text-g5 text-xs opacity-40 cursor-not-allowed">&#8250;</button>
        </div>
      </div>
    </div>

    <!-- ===== CREATE API KEY MODAL ===== -->
    <AppModal v-model="showCreateModal">
      <template #title>Create API Key</template>

      <!-- Key Name -->
      <div class="mb-5">
        <label class="block text-[11px] font-mono font-medium text-g4 uppercase tracking-wider mb-2">API Key Name</label>
        <input
          v-model="newKeyName"
          type="text"
          placeholder="Enter key name"
          class="w-full px-3 py-2 bg-card2 border border-border2 rounded-rxs text-xs text-g2 placeholder-g5 focus:outline-none focus:border-grn/40 transition-all"
        />
      </div>

      <!-- Validity -->
      <div class="mb-5">
        <label class="block text-[11px] font-mono font-medium text-g4 uppercase tracking-wider mb-3">Validity</label>
        <div class="space-y-2">
          <!-- Never Expires -->
          <label
            :class="[
              'flex items-start gap-3 p-3 border rounded-rs cursor-pointer transition-all',
              validityType === 'never' ? 'border-grn/40 bg-grn/5' : 'border-border1 hover:border-border2'
            ]"
          >
            <input type="radio" v-model="validityType" value="never" class="mt-0.5 accent-green-400" />
            <div>
              <div class="text-xs font-medium text-g2">Never Expires</div>
              <div class="text-[11px] text-g4 mt-0.5">API key will remain valid indefinitely</div>
            </div>
          </label>

          <!-- Duration -->
          <label
            :class="[
              'flex items-start gap-3 p-3 border rounded-rs cursor-pointer transition-all',
              validityType === 'duration' ? 'border-grn/40 bg-grn/5' : 'border-border1 hover:border-border2'
            ]"
          >
            <input type="radio" v-model="validityType" value="duration" class="mt-0.5 accent-green-400" />
            <div class="flex-1">
              <div class="text-xs font-medium text-g2">Duration</div>
              <div class="text-[11px] text-g4 mt-0.5">Set expiration based on number of months</div>
              <div v-if="validityType === 'duration'" class="flex gap-3 mt-2" @click.stop>
                <input
                  v-model="durationValue"
                  type="number"
                  min="1"
                  placeholder="e.g. 6"
                  class="flex-1 px-3 py-2 bg-card2 border border-border2 rounded-rxs text-xs text-g2 focus:outline-none focus:border-grn/40 transition-all"
                />
                <span class="flex items-center text-xs text-g4 px-1">months</span>
              </div>
            </div>
          </label>

          <!-- Date -->
          <label
            :class="[
              'flex items-start gap-3 p-3 border rounded-rs cursor-pointer transition-all',
              validityType === 'date' ? 'border-grn/40 bg-grn/5' : 'border-border1 hover:border-border2'
            ]"
          >
            <input type="radio" v-model="validityType" value="date" class="mt-0.5 accent-green-400" />
            <div class="flex-1">
              <div class="text-xs font-medium text-g2">Specific Date</div>
              <div class="text-[11px] text-g4 mt-0.5">Choose an exact expiration date</div>
              <div v-if="validityType === 'date'" class="mt-2" @click.stop>
                <input
                  v-model="expiryDate"
                  type="date"
                  class="w-full px-3 py-2 bg-card2 border border-border2 rounded-rxs text-xs text-g2 focus:outline-none focus:border-grn/40 transition-all"
                />
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Generate Key Section -->
      <div class="mb-4">
        <label class="block text-[11px] font-mono font-medium text-g4 uppercase tracking-wider mb-2">API Key</label>

        <!-- Warning -->
        <div class="flex gap-2.5 bg-amber-950/30 border border-amber-800/40 rounded-rs p-3 mb-3">
          <AlertTriangle class="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p class="text-[11px] text-amber-300/90 leading-relaxed"><strong>Important:</strong> This key will only be shown once. Copy it now and store it securely.</p>
        </div>

        <!-- Key display box -->
        <div class="bg-card2 border border-border2 rounded-rs p-3 mb-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-mono text-g4">Generated Key</span>
            <button
              @click="copyGeneratedKey"
              :disabled="!generatedKey"
              :class="[
                'bg-transparent border rounded-rxs px-3 py-[6px] text-xs font-medium transition-all',
                generatedKey
                  ? 'border-border2 text-g2 hover:bg-card hover:text-white cursor-pointer'
                  : 'border-border1 text-g5 cursor-not-allowed'
              ]"
            >{{ copiedKey ? 'Copied!' : 'Copy' }}</button>
          </div>
          <div v-if="generatedKey" class="font-mono text-[11px] text-grn break-all leading-relaxed">{{ generatedKey }}</div>
          <div v-else class="text-[11px] text-g5">Click "Generate" to create your key</div>
        </div>

        <!-- Generate button -->
        <button
          @click="generateKey"
          class="w-full py-2 bg-transparent border border-border2 text-g2 hover:bg-card hover:text-white rounded-rxs text-xs font-medium transition-all mb-3"
        >
          Generate API Key
        </button>

        <!-- Checkbox -->
        <label class="flex items-center gap-3 bg-card2 border border-border1 rounded-rs p-3 cursor-pointer">
          <input type="checkbox" v-model="keyCopiedConfirmed" class="w-3.5 h-3.5 accent-green-400 cursor-pointer" />
          <span class="text-xs text-g2">I have copied and saved this API key securely</span>
        </label>
      </div>

      <template #footer>
        <button
          @click="closeModal"
          class="bg-transparent text-g2 border border-border2 hover:bg-card hover:text-white rounded-rxs px-3 py-[6px] text-xs font-medium transition-all"
        >Cancel</button>
        <button
          @click="saveKey"
          :disabled="!keyCopiedConfirmed || !generatedKey"
          :class="[
            'rounded-rxs px-3 py-[6px] text-xs font-medium transition-all',
            keyCopiedConfirmed && generatedKey
              ? 'bg-grn text-black hover:bg-grn2 cursor-pointer'
              : 'bg-card2 text-g5 cursor-not-allowed border border-border1'
          ]"
        >Save API Key</button>
      </template>
    </AppModal>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout  from '../components/AppLayout.vue'
import AppModal   from '../components/AppModal.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { AlertTriangle } from 'lucide-vue-next'

// ---- API Keys data ----
let nextId = 5
const apiKeys = ref([
  {
    id: 1,
    name: 'Production Key',
    maskedKey: 'sanas-live-****...****abcd',
    group: 'Production',
    createdAt: 'Mar 10 2026',
    createdBy: 'zupudi.uday',
    expiresAt: 'Never',
    status: 'active',
    deployment: 'cloud',
  },
  {
    id: 2,
    name: 'Staging Key',
    maskedKey: 'sanas-test-****...****ef12',
    group: 'Staging',
    createdAt: 'Mar 8 2026',
    createdBy: 'jerrand.paloma',
    expiresAt: 'Mar 10 2027',
    status: 'expiring',
    deployment: 'self-hosted',
  },
  {
    id: 3,
    name: 'UAT Key',
    maskedKey: 'sanas-test-****...****9900',
    group: 'UAT',
    createdAt: 'Feb 20 2026',
    createdBy: 'Kushant Gang',
    expiresAt: 'Feb 20 2026',
    status: 'expired',
    deployment: 'cloud',
  },
  {
    id: 4,
    name: 'OnePlus Key',
    maskedKey: 'sanas-live-****...****3344',
    group: 'Production > OnePlus',
    createdAt: 'Mar 1 2026',
    createdBy: 'Rohit',
    expiresAt: 'Never',
    status: 'active',
    deployment: 'cloud',
  },
])

// ---- Filters ----
const searchQuery = ref('')
const statusFilter = ref('')

const filteredKeys = computed(() => {
  return apiKeys.value.filter(k => {
    const matchesSearch =
      !searchQuery.value ||
      k.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      k.maskedKey.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      k.group.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || k.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

function deleteKey(id) {
  if (window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
    const idx = apiKeys.value.findIndex(k => k.id === id)
    if (idx >= 0) apiKeys.value.splice(idx, 1)
  }
}

// ---- Create modal ----
const showCreateModal = ref(false)
const newKeyName = ref('')
const validityType = ref('never')
const durationValue = ref('')
const expiryDate = ref('')
const generatedKey = ref('')
const keyCopiedConfirmed = ref(false)
const copiedKey = ref(false)

function generateKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let suffix = ''
  for (let i = 0; i < 32; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
  generatedKey.value = `sanas-live-${suffix}`
  keyCopiedConfirmed.value = false
  copiedKey.value = false
}

function copyGeneratedKey() {
  if (!generatedKey.value) return
  navigator.clipboard.writeText(generatedKey.value).catch(() => {})
  copiedKey.value = true
  setTimeout(() => { copiedKey.value = false }, 2000)
}

function maskKey(fullKey) {
  const prefix = fullKey.startsWith('sanas-live-') ? 'sanas-live-' : 'sanas-test-'
  const last4 = fullKey.slice(-4)
  return `${prefix}****...****${last4}`
}

function saveKey() {
  if (!keyCopiedConfirmed.value || !generatedKey.value) return
  const keyName = newKeyName.value.trim() || 'New API Key'
  let expiresDisplay = 'Never'
  if (validityType.value === 'duration' && durationValue.value) {
    expiresDisplay = `${durationValue.value} months`
  } else if (validityType.value === 'date' && expiryDate.value) {
    expiresDisplay = new Date(expiryDate.value).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }
  apiKeys.value.push({
    id: nextId++,
    name: keyName,
    maskedKey: maskKey(generatedKey.value),
    group: 'Production',
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    createdBy: 'zupudi.uday',
    expiresAt: expiresDisplay,
    status: 'active',
    deployment: 'cloud',
  })
  closeModal()
}

function closeModal() {
  showCreateModal.value = false
  newKeyName.value = ''
  validityType.value = 'never'
  durationValue.value = ''
  expiryDate.value = ''
  generatedKey.value = ''
  keyCopiedConfirmed.value = false
  copiedKey.value = false
}
</script>
