<template>
  <AccountLayout
    :account-id="accountId"
    :account-name="accountName"
    active-nav="dashboard"
  >
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="font-display text-[22px] font-bold text-white leading-tight">Dashboard</h1>
      <p class="text-g3 text-sm mt-1">Manage your SDK keys and developer resources</p>
    </div>

    <!-- ===== SDK KEYS SECTION (only if Self Hosted SDK plan) ===== -->
    <div v-if="hasSelfHostedSDK" class="bg-card border border-border1 rounded-r p-[18px] mb-5">
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-white">Self Hosted SDK Keys</h2>
        <button
          @click="showCreateForm = !showCreateForm"
          class="bg-grn text-black hover:bg-grn/90 rounded-rxs px-3 py-[6px] text-xs font-medium inline-flex items-center gap-[5px] transition-colors"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Create New Key
        </button>
      </div>

      <!-- Create New Key Form -->
      <div v-if="showCreateForm" class="bg-card2 border border-border1 rounded-rs p-4 mb-4">
        <div class="mb-4">
          <label class="block text-xs font-medium text-g3 mb-1.5">Key Name</label>
          <input
            v-model="newKeyName"
            type="text"
            placeholder="e.g., Production Key"
            class="w-full px-3 py-2 bg-[#060606] border border-border2 rounded-rxs text-sm text-white placeholder-g5 focus:border-grn/40 outline-none transition-colors"
          />
        </div>
        <div class="mb-4">
          <label class="block text-xs font-medium text-g3 mb-1.5">Expiry Date</label>
          <input
            v-model="newKeyExpiry"
            type="date"
            class="w-full px-3 py-2 bg-[#060606] border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none transition-colors"
          />
        </div>
        <div class="flex gap-2">
          <button
            @click="cancelCreateForm"
            class="bg-transparent text-g2 border border-border2 hover:bg-card hover:text-white rounded-rxs px-3 py-[6px] text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            @click="createNewKey"
            class="bg-grn text-black hover:bg-grn/90 rounded-rxs px-3 py-[6px] text-xs font-medium inline-flex items-center gap-[5px] transition-colors"
          >
            Create Key
          </button>
        </div>
      </div>

      <!-- Keys List -->
      <div v-if="sdkKeys.length > 0" class="space-y-2">
        <div
          v-for="key in sdkKeys"
          :key="key.id"
          class="bg-card2 border border-border1 rounded-rs p-3 flex items-center gap-3"
        >
          <!-- Key icon -->
          <div class="w-8 h-8 rounded-rxs bg-grn/10 border border-grn/20 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-grn" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
            </svg>
          </div>

          <!-- Key info -->
          <div class="flex-1 min-w-0">
            <div class="text-xs font-medium text-white mb-0.5">{{ key.name }}</div>
            <div class="font-mono text-[11px] text-g4 truncate">{{ key.revealed ? key.fullKey : key.maskedKey }}</div>
          </div>

          <!-- Expiry -->
          <div class="text-[10px] font-mono text-g5 shrink-0">
            {{ key.expiry ? 'Exp: ' + key.expiry : 'No expiry' }}
          </div>

          <!-- Actions -->
          <div class="flex gap-1.5 shrink-0">
            <!-- Eye toggle -->
            <button
              @click="toggleReveal(key)"
              class="bg-transparent text-g3 border border-border2 hover:bg-card hover:text-white rounded-rxs px-2 py-1 text-xs transition-colors"
              :title="key.revealed ? 'Hide key' : 'Show key'"
            >
              <svg v-if="!key.revealed" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
            <!-- Copy button -->
            <button
              @click="copyKey(key)"
              class="bg-transparent text-g3 border border-border2 hover:bg-card hover:text-white rounded-rxs px-2 py-1 text-[11px] font-mono transition-colors whitespace-nowrap"
            >
              <span v-if="key.copied">Copied!</span>
              <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Zero State -->
      <div v-else class="py-10 px-6 text-center border border-dashed border-border1 rounded-rs">
        <svg class="w-10 h-10 text-border2 mx-auto mb-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
        </svg>
        <h3 class="text-sm font-semibold text-white mb-1">No SDK Keys Yet</h3>
        <p class="text-g4 text-xs mb-4">Create your first SDK key to start using the Sanas Self Hosted SDK</p>
        <button
          @click="showCreateForm = true"
          class="bg-grn text-black hover:bg-grn/90 rounded-rxs px-3 py-[6px] text-xs font-medium inline-flex items-center gap-[5px] transition-colors"
        >
          Create Your First Key
        </button>
      </div>
    </div>

    <!-- ===== GET STARTED SECTION ===== -->
    <div class="bg-card border border-border1 rounded-r p-[18px] mb-5">
      <h2 class="text-sm font-semibold text-white mb-1">Get Started</h2>
      <p class="text-g3 text-xs mb-5">Get started with the Sanas Self Hosted SDK by downloading and running your first model.</p>

      <!-- Code Block 1 -->
      <div class="text-xs font-medium text-g3 mb-2">1. Download the SDK</div>
      <div class="relative bg-[#060606] border border-border1 rounded-rs p-[14px_16px] mb-5">
        <!-- Header bar -->
        <div class="flex items-center justify-between mb-3">
          <span class="font-mono text-[10px] bg-card2 border border-border1 rounded px-[6px] py-[2px] text-g4">bash</span>
          <button
            @click="copyCode('download')"
            class="bg-transparent text-g3 border border-border2 hover:bg-card2 hover:text-white rounded-rxs px-2 py-1 text-[10px] font-mono transition-colors"
          >
            {{ copiedBlock === 'download' ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        <pre class="font-mono text-[11.5px] text-g2 leading-[1.8] overflow-x-auto"><code><span class="text-g5"># Install via pip</span>
pip install sanas-sdk

<span class="text-g5"># Or via curl</span>
curl -O https://sdk.sanas.ai/download/latest/sanas-sdk.tar.gz</code></pre>
      </div>

      <!-- Code Block 2 -->
      <div class="text-xs font-medium text-g3 mb-2">2. Initialize and run a model</div>
      <div class="relative bg-[#060606] border border-border1 rounded-rs p-[14px_16px] mb-5">
        <!-- Header bar -->
        <div class="flex items-center justify-between mb-3">
          <span class="font-mono text-[10px] bg-card2 border border-border1 rounded px-[6px] py-[2px] text-g4">python</span>
          <button
            @click="copyCode('init')"
            class="bg-transparent text-g3 border border-border2 hover:bg-card2 hover:text-white rounded-rxs px-2 py-1 text-[10px] font-mono transition-colors"
          >
            {{ copiedBlock === 'init' ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        <pre class="font-mono text-[11.5px] text-g2 leading-[1.8] overflow-x-auto"><code><span class="text-purple-400">from</span> sanas <span class="text-purple-400">import</span> SanasClient

client = SanasClient(api_key=<span class="text-grn">"sanas-live-..."</span>)

<span class="text-g5"># Load and run a model</span>
model = client.models.load(<span class="text-grn">"accent-en-us"</span>)
result = model.process(audio_data)</code></pre>
      </div>

      <a
        href="https://developer.sanas.ai"
        target="_blank"
        class="inline-flex items-center gap-1.5 text-grn hover:text-grn/80 text-xs font-medium transition-colors"
      >
        View full documentation
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>
    </div>

    <!-- ===== PLAYGROUND SECTION ===== -->
    <div class="bg-card border border-border1 rounded-r p-[18px]">
      <div class="flex items-center gap-3 mb-2">
        <h2 class="text-sm font-semibold text-white">Sanas Playground</h2>
        <span class="inline-flex items-center px-2 py-[2px] bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded text-[10px] font-medium font-mono">
          Coming Soon
        </span>
      </div>
      <p class="text-g3 text-xs mb-5">Test and experiment with Sanas models directly in your browser. No setup required.</p>

      <!-- Preview Card -->
      <div class="bg-card2 border border-dashed border-border2 rounded-rs py-12 px-8 text-center">
        <div class="text-4xl mb-3 opacity-30 text-g4">◆</div>
        <h3 class="text-sm font-medium text-g2 mb-1">Interactive Model Playground</h3>
        <p class="text-g4 text-xs mb-5">Try out accent translation and more with our interactive playground interface.</p>
        <button
          disabled
          class="bg-card2 text-g5 rounded-rxs px-3 py-[6px] text-xs font-medium cursor-not-allowed border border-border1 inline-flex items-center gap-1"
        >
          Launch Playground
        </button>
      </div>
    </div>
  </AccountLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AccountLayout from '../components/AccountLayout.vue'

const route = useRoute()

// ===== Route params =====
const accountName = computed(() => route.query.name || 'Account')
const accountId = computed(() => route.params.id || 'ACC001')
const plans = computed(() => {
  try { return JSON.parse(route.query.plans || '[]') } catch { return [] }
})
const hasSelfHostedSDK = computed(() => plans.value.includes('Self Hosted SDK'))

// ===== SDK Keys =====
const showCreateForm = ref(false)
const newKeyName = ref('')
const newKeyExpiry = ref('')

const sdkKeys = ref([
  {
    id: 1,
    name: 'Production Key',
    fullKey: 'sanas-live-Kf9mNpQ2xRsT5vWyZ8aB3cD6eF1gH4iJ7kLmNo0Jx2A',
    maskedKey: 'sanas-live-Kf9m...Jx2A',
    expiry: '2026-12-31',
    revealed: false,
    copied: false,
  },
  {
    id: 2,
    name: 'Staging Key',
    fullKey: 'sanas-test-Mn3pQr7sT9uVwXyZ2aB5cD8eF0gH6iJ1kLmNoPqQp7B',
    maskedKey: 'sanas-test-Mn3p...Qp7B',
    expiry: '2026-06-30',
    revealed: false,
    copied: false,
  },
])

let nextKeyId = 3

function cancelCreateForm() {
  showCreateForm.value = false
  newKeyName.value = ''
  newKeyExpiry.value = ''
}

function generateKey(prefix) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let key = prefix + '_'
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return key
}

function createNewKey() {
  if (!newKeyName.value.trim()) return
  const prefix = newKeyName.value.toLowerCase().includes('prod') ? 'sanas-live' : 'sanas-test'
  const fullKey = generateKey(prefix)
  const masked = fullKey.substring(0, 12) + '...' + fullKey.slice(-4)
  sdkKeys.value.push({
    id: nextKeyId++,
    name: newKeyName.value.trim(),
    fullKey,
    maskedKey: masked,
    expiry: newKeyExpiry.value || null,
    revealed: false,
    copied: false,
  })
  cancelCreateForm()
}

function toggleReveal(key) {
  key.revealed = !key.revealed
}

function copyKey(key) {
  navigator.clipboard.writeText(key.fullKey).catch(() => {})
  key.copied = true
  setTimeout(() => { key.copied = false }, 2000)
}

// ===== Code block copy =====
const copiedBlock = ref(null)

const codeBlocks = {
  download: `# Install via pip\npip install sanas-sdk\n\n# Or via curl\ncurl -O https://sdk.sanas.ai/download/latest/sanas-sdk.tar.gz`,
  init: `from sanas import SanasClient\n\nclient = SanasClient(api_key="sanas-live-...")\n\n# Load and run a model\nmodel = client.models.load("accent-en-us")\nresult = model.process(audio_data)`,
}

function copyCode(block) {
  navigator.clipboard.writeText(codeBlocks[block]).catch(() => {})
  copiedBlock.value = block
  setTimeout(() => { copiedBlock.value = null }, 2000)
}
</script>
