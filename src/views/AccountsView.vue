<template>
  <AppLayout active-id="accounts">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="font-display text-[22px] font-bold tracking-[-0.02em] text-white">Accounts</h1>
      <p class="text-g3 text-sm mt-0.5">Manage your accounts and billing plans</p>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2.5">
        <!-- Search -->
        <div class="relative">
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-g4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search accounts..."
            class="bg-card2 border border-border2 rounded-rxs text-white text-[12.5px] p-[8px_10px] pl-8 focus:border-grn/40 outline-none transition-colors placeholder:text-g5 w-[240px]"
          />
        </div>

        <!-- Billing Plan Filter -->
        <select
          v-model="planFilter"
          class="select-chevron bg-card2 border border-border2 rounded-rxs text-[12.5px] p-[8px_10px] focus:border-grn/40 outline-none transition-colors appearance-none cursor-pointer pr-8 text-g2"
        >
          <option value="">All Billing Plans</option>
          <option value="Self Hosted SDK">Self Hosted SDK</option>
          <option value="Sanas Cloud SDK">Sanas Cloud SDK</option>
        </select>
      </div>

      <!-- Create Account Button -->
      <button
        class="bg-grn text-black text-[12.5px] font-semibold px-4 py-[8px] rounded-rxs hover:opacity-90 transition-opacity"
        @click="showCreateModal = true"
      >
        Create Account
      </button>
    </div>

    <!-- Table -->
    <div class="bg-card border border-border1 rounded-r overflow-hidden">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-border1">
            <th class="text-left px-[11px] py-[7px] text-[10px] font-mono text-g4 uppercase tracking-[0.04em]">Account Name</th>
            <th class="text-left px-[11px] py-[7px] text-[10px] font-mono text-g4 uppercase tracking-[0.04em]">Account ID</th>
            <th class="text-left px-[11px] py-[7px] text-[10px] font-mono text-g4 uppercase tracking-[0.04em]">Admins</th>
            <th class="text-left px-[11px] py-[7px] text-[10px] font-mono text-g4 uppercase tracking-[0.04em]">Parent Group</th>
            <th class="text-left px-[11px] py-[7px] text-[10px] font-mono text-g4 uppercase tracking-[0.04em]">Billing Plans</th>
            <th class="text-left px-[11px] py-[7px] text-[10px] font-mono text-g4 uppercase tracking-[0.04em]">Created On</th>
            <th class="text-left px-[11px] py-[7px] text-[10px] font-mono text-g4 uppercase tracking-[0.04em]">Created By</th>
            <th class="px-[11px] py-[7px]"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(acc, idx) in filteredAccounts"
            :key="acc.id + idx"
            class="border-b border-border1 last:border-b-0 hover:bg-white/[0.015] transition-all cursor-pointer"
            @click="navigateToAccount(acc)"
          >
            <!-- Account Name -->
            <td class="px-[11px] py-3 text-[13px]">
              <span class="text-white font-medium">{{ acc.name }}</span>
            </td>

            <!-- Account ID -->
            <td class="px-[11px] py-3 text-[13px]">
              <span class="font-mono text-g4">{{ acc.id }}</span>
            </td>

            <!-- Admins -->
            <td class="px-[11px] py-3">
              <div class="flex items-center">
                <div
                  v-for="(admin, ai) in acc.admins"
                  :key="ai"
                  :class="['w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold bg-grn text-black border-2 border-card', ai > 0 ? '-ml-1.5' : '']"
                >
                  {{ admin.init }}
                </div>
              </div>
            </td>

            <!-- Parent Group -->
            <td class="px-[11px] py-3 text-[13px]">
              <span class="text-g3">{{ acc.parentGroup }}</span>
            </td>

            <!-- Billing Plans -->
            <td class="px-[11px] py-3">
              <div class="flex flex-col gap-1">
                <StatusBadge
                  v-for="plan in acc.plans"
                  :key="plan"
                  :value="plan.toLowerCase()"
                />
              </div>
            </td>

            <!-- Created On -->
            <td class="px-[11px] py-3 text-[12px] font-mono text-g4">{{ acc.date }}</td>

            <!-- Created By -->
            <td class="px-[11px] py-3 text-[12px] font-mono text-g4">{{ acc.creator }}</td>

            <!-- Actions -->
            <td class="px-[11px] py-3 relative" @click.stop>
              <button
                class="px-2 py-0.5 text-lg text-g4 rounded hover:bg-white/[0.06] hover:text-white transition-all leading-none"
                @click.stop="toggleMenu(idx)"
              >⋯</button>

              <!-- Dropdown -->
              <div
                v-if="openMenuIdx === idx"
                class="absolute right-0 top-full mt-1 bg-card2 border border-border2 rounded-rs min-w-[180px] z-50 overflow-hidden shadow-xl"
              >
                <div
                  class="px-3.5 py-2 text-[12.5px] text-g2 border-b border-border1 cursor-pointer hover:bg-white/[0.04] hover:text-white transition-colors"
                  @click.stop="navigateToAccount(acc)"
                >Go to Account</div>
                <div
                  class="px-3.5 py-2 text-[12.5px] text-g2 border-b border-border1 cursor-pointer hover:bg-white/[0.04] hover:text-white transition-colors"
                  @click.stop="openMenuIdx = null"
                >Edit Account Details</div>
                <div
                  class="px-3.5 py-2 text-[12.5px] text-g2 cursor-pointer hover:bg-white/[0.04] hover:text-white transition-colors"
                  @click.stop="openMenuIdx = null"
                >Edit Subscriptions</div>
              </div>
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-if="filteredAccounts.length === 0">
            <td colspan="8" class="px-4 py-10 text-center text-g5 font-mono text-sm">
              No accounts match your search.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Account Modal -->
    <AppModal v-model="showCreateModal">
      <template #title>Create Account</template>

      <div class="space-y-4">
        <!-- Account Name -->
        <div>
          <label class="block font-mono text-[11px] text-g3 mb-1.5">Account Name</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Enter account name"
            class="w-full bg-card2 border border-border2 rounded-rxs text-white text-[12.5px] p-[8px_10px] focus:border-grn/40 outline-none transition-colors placeholder:text-g5"
          />
        </div>

        <!-- Account Admin -->
        <div>
          <label class="block font-mono text-[11px] text-g3 mb-1.5">Account Admin Email</label>
          <input
            v-model="form.admin"
            type="email"
            placeholder="admin@example.com"
            class="w-full bg-card2 border border-border2 rounded-rxs text-white text-[12.5px] p-[8px_10px] focus:border-grn/40 outline-none transition-colors placeholder:text-g5"
          />
        </div>

        <!-- Parent Group -->
        <div>
          <label class="block font-mono text-[11px] text-g3 mb-1.5">Parent Group</label>
          <select
            v-model="form.parentGroup"
            class="select-chevron w-full bg-card2 border border-border2 rounded-rxs text-g2 text-[12.5px] p-[8px_10px] focus:border-grn/40 outline-none transition-colors appearance-none cursor-pointer pr-7"
          >
            <option value="">Select parent group</option>
            <option value="Direct CX">Direct CX</option>
            <option value="Self Serve">Self Serve</option>
          </select>
        </div>

        <!-- Billing Plans -->
        <div>
          <label class="block font-mono text-[11px] text-g3 mb-2">Billing Plans</label>
          <div class="flex flex-col gap-2">
            <label class="flex items-center gap-2 text-[12.5px] text-g2 cursor-pointer">
              <input type="checkbox" v-model="form.plans" value="Self Hosted SDK" class="w-3.5 h-3.5 cursor-pointer accent-[#4ade80]" />
              Self Hosted SDK
            </label>
            <label class="flex items-center gap-2 text-[12.5px] text-g2 cursor-pointer">
              <input type="checkbox" v-model="form.plans" value="Sanas Cloud SDK" class="w-3.5 h-3.5 cursor-pointer accent-[#4ade80]" />
              Sanas Cloud SDK
            </label>
          </div>
        </div>
      </div>

      <template #footer>
        <!-- Auto-fill -->
        <button
          class="px-4 py-2 rounded-rxs border border-border2 bg-transparent text-g3 text-[12.5px] hover:bg-card hover:text-white transition-all flex items-center gap-1.5"
          @click="autoFill"
        >
          <Zap class="w-3.5 h-3.5" /> Auto-fill
        </button>

        <!-- Cancel + Create -->
        <div class="flex gap-2.5">
          <button
            class="px-4 py-2 rounded-rxs border border-border2 bg-transparent text-g3 text-[12.5px] font-medium hover:bg-card hover:text-white transition-all"
            @click="showCreateModal = false"
          >Cancel</button>
          <button
            class="px-4 py-2 rounded-rxs bg-grn text-black text-[12.5px] font-semibold hover:opacity-90 transition-opacity"
            @click="createAccount"
          >Create</button>
        </div>
      </template>
    </AppModal>
  </AppLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import AppModal from '../components/AppModal.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { Zap } from 'lucide-vue-next'

const router = useRouter()

// ── Data ──────────────────────────────────────────────────────────────────────
const accounts = ref([
  { name: 'Self Technologies Inc', id: 'MMNYBVQH', admins: [{ init: 'JM', color: 'green' }, { init: 'AP', color: 'blue' }], parentGroup: 'Production > OnePlus', plans: ['Self Hosted SDK', 'Sanas Cloud SDK'], date: '13 Mar 2026', creator: 'jerrand.paloma' },
  { name: 'Rohit-cx-test', id: 'MMM3S6AD', admins: [{ init: 'RK', color: 'green' }], parentGroup: 'Production > Real Me', plans: ['Sanas Cloud SDK'], date: '11 Mar 2026', creator: 'Rohit.mosigan@san...' },
  { name: 'R1RCM', id: 'R1RCM001', admins: [{ init: 'SY', color: 'green' }], parentGroup: 'Production', plans: ['Self Hosted SDK', 'Sanas Cloud SDK'], date: '15 Mar 2026', creator: 'System' },
  { name: 'PJ Testing Account', id: 'MMLUXIXU', admins: [{ init: 'PJ', color: 'green' }], parentGroup: 'Staging', plans: ['Self Hosted SDK'], date: '11 Mar 2026', creator: 'Pratyaksha Joshi' },
  { name: 'Pitch Perfect Solutions', id: 'MMKZEXKO', admins: [{ init: 'JM', color: 'green' }, { init: 'AP', color: 'blue' }], parentGroup: 'Production > OnePlus', plans: ['Self Hosted SDK', 'Sanas Cloud SDK'], date: '11 Mar 2026', creator: 'jerrand.paloma' },
  { name: 'Test Kushant', id: 'MMKT9K36', admins: [{ init: 'KG', color: 'green' }], parentGroup: 'UAT', plans: ['Sanas Cloud SDK'], date: '10 Mar 2026', creator: 'Kushant Gang' },
  { name: 'Jerrand Test AT', id: 'MMKH3VYN', admins: [{ init: 'JM', color: 'green' }], parentGroup: 'Staging', plans: ['Self Hosted SDK'], date: '10 Mar 2026', creator: 'jerrand.paloma' },
  { name: 'Jerrand Test AT', id: 'MMKRW3H3', admins: [{ init: 'JM', color: 'green' }], parentGroup: 'Production > OnePay', plans: ['Self Hosted SDK', 'Sanas Cloud SDK'], date: '10 Mar 2026', creator: 'jerrand.paloma' },
  { name: 'Production', id: 'MMKRP8YY', admins: [{ init: 'ZU', color: 'green' }], parentGroup: 'Production', plans: ['Sanas Cloud SDK'], date: '10 Mar 2026', creator: 'Zupudi.uday@san...' },
  { name: 'Pratyaksha Test', id: 'MMKDFRSM', admins: [{ init: 'PJ', color: 'green' }, { init: 'AP', color: 'blue' }], parentGroup: 'Production > Real Me', plans: ['Self Hosted SDK'], date: '10 Mar 2026', creator: 'pratyaksha.joshi...' },
])

// ── Filter state ──────────────────────────────────────────────────────────────
const searchQuery = ref('')
const planFilter = ref('')

const filteredAccounts = computed(() => {
  const q = searchQuery.value.toLowerCase()
  const p = planFilter.value
  return accounts.value.filter(acc => {
    const matchSearch = !q || acc.name.toLowerCase().includes(q) || acc.id.toLowerCase().includes(q)
    const matchPlan = !p || acc.plans.includes(p)
    return matchSearch && matchPlan
  })
})

// ── Dropdown ──────────────────────────────────────────────────────────────────
const openMenuIdx = ref(null)

function toggleMenu(idx) {
  openMenuIdx.value = openMenuIdx.value === idx ? null : idx
}

function handleGlobalClick() {
  openMenuIdx.value = null
}

onMounted(() => document.addEventListener('click', handleGlobalClick))
onBeforeUnmount(() => document.removeEventListener('click', handleGlobalClick))

// ── Navigation ────────────────────────────────────────────────────────────────
function navigateToAccount(acc) {
  openMenuIdx.value = null
  const plans = encodeURIComponent(JSON.stringify(acc.plans))
  router.push(`/accounts/${acc.id}?name=${encodeURIComponent(acc.name)}&plans=${plans}`)
}

// ── Create Modal ──────────────────────────────────────────────────────────────
const showCreateModal = ref(false)

const emptyForm = () => ({ name: '', admin: '', parentGroup: '', plans: [] })
const form = ref(emptyForm())

watch(showCreateModal, (val) => { if (!val) form.value = emptyForm() })

function autoFill() {
  form.value.name = 'Test Account ' + Math.floor(Math.random() * 1000)
  form.value.admin = 'test.admin@sanas.ai'
  form.value.parentGroup = 'Direct CX'
  form.value.plans = ['Self Hosted SDK', 'Sanas Cloud SDK']
}

function createAccount() {
  const { name, admin, parentGroup, plans } = form.value
  if (!name.trim() || !admin.trim() || !parentGroup) {
    alert('Please fill in all required fields.')
    return
  }
  if (plans.length === 0) {
    alert('Please select at least one billing plan.')
    return
  }

  const accountId = 'MM' + Math.random().toString(36).substring(2, 8).toUpperCase()
  const initials = admin.split('@')[0].substring(0, 2).toUpperCase()
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  accounts.value.unshift({
    name: name.trim(),
    id: accountId,
    admins: [{ init: initials, color: 'green' }],
    parentGroup,
    plans: [...plans],
    date: today,
    creator: admin,
  })

  showCreateModal.value = false
}
</script>

<style scoped>
.select-chevron {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}
</style>
