<template>
  <AppLayout active-id="members">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="font-display text-xl font-semibold text-white">Sanas Members</h1>
      <p class="text-xs text-g3 mt-1">Manage portal users and their access roles.</p>
    </div>

    <!-- Sub-tab -->
    <div class="flex gap-6 mb-6 border-b border-border1">
      <div class="px-1 pb-3 text-sm font-medium text-white border-b-2 border-grn cursor-pointer -mb-px">
        Portal Users
      </div>
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
          placeholder="Search Portal Users"
          class="pl-8 pr-3 py-[6px] w-[260px] bg-card2 border border-border2 rounded-rxs text-xs text-g2 placeholder-g5 focus:outline-none focus:border-grn/40 transition-all"
        />
      </div>
      <div class="flex items-center gap-2">
        <select
          v-model="roleFilter"
          class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-xs text-g2 appearance-none cursor-pointer hover:border-border2 focus:outline-none focus:border-grn/40 transition-all"
        >
          <option value="">All Roles</option>
          <option value="Sanas Admin">Sanas Admin</option>
          <option value="Sanas User">Sanas User</option>
        </select>
        <select
          v-model="statusFilter"
          class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-xs text-g2 appearance-none cursor-pointer hover:border-border2 focus:outline-none focus:border-grn/40 transition-all"
        >
          <option value="">All Status</option>
          <option value="activated">Activated</option>
          <option value="deactivated">Deactivated</option>
          <option value="invitation-sent">Invitation Sent</option>
        </select>
        <button class="bg-grn text-black hover:bg-grn2 rounded-rxs px-3 py-[6px] text-xs font-medium flex items-center gap-1.5 transition-colors">
          <span>Invite &amp; Manage</span>
          <Check class="w-3 h-3" />
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-card border border-border1 rounded-r overflow-hidden">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-border1">
            <th class="text-left px-4 py-3 text-[11px] font-mono font-medium text-g4 uppercase tracking-wider">Name</th>
            <th class="text-left px-4 py-3 text-[11px] font-mono font-medium text-g4 uppercase tracking-wider">Email Id</th>
            <th class="text-left px-4 py-3 text-[11px] font-mono font-medium text-g4 uppercase tracking-wider">
              <span class="flex items-center gap-1">Status <Info class="w-3 h-3" /></span>
            </th>
            <th class="text-left px-4 py-3 text-[11px] font-mono font-medium text-g4 uppercase tracking-wider cursor-pointer select-none">
              <span class="flex items-center gap-1">Created On <ArrowUpDown class="w-3 h-3" /></span>
            </th>
            <th class="text-left px-4 py-3 text-[11px] font-mono font-medium text-g4 uppercase tracking-wider">Created By</th>
            <th class="text-left px-4 py-3 text-[11px] font-mono font-medium text-g4 uppercase tracking-wider">Manage Access</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="member in filteredMembers"
            :key="member.email"
            class="border-b border-border1 last:border-0 hover:bg-card2 transition-colors"
          >
            <td class="px-4 py-3 text-xs text-g2">{{ member.name }}</td>
            <td class="px-4 py-3 text-xs font-mono text-g3">{{ member.email }}</td>
            <td class="px-4 py-3 text-xs">
              <StatusBadge :value="member.status" />
            </td>
            <td class="px-4 py-3 text-xs text-g3">{{ member.date }}</td>
            <td class="px-4 py-3 text-xs text-g3">{{ member.creator }}</td>
            <td class="px-4 py-3 text-xs">
              <a v-if="member.access" href="#" class="text-grn hover:underline text-xs">{{ member.access }}</a>
              <span v-else class="text-g5">—</span>
            </td>
          </tr>
          <tr v-if="filteredMembers.length === 0">
            <td colspan="6" class="px-4 py-10 text-center text-g5 text-xs">No members found</td>
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
        <span class="text-xs text-g4">1-10 of 84</span>
        <div class="flex gap-1">
          <button disabled class="w-7 h-7 border border-border2 bg-card2 rounded-rxs flex items-center justify-center text-g5 text-xs opacity-40 cursor-not-allowed">‹</button>
          <button class="w-7 h-7 border border-border2 bg-card2 rounded-rxs flex items-center justify-center text-g3 text-xs hover:border-grn/40 hover:text-white transition-all cursor-pointer">›</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout   from '../components/AppLayout.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { Check, Info, ArrowUpDown } from 'lucide-vue-next'

const searchQuery  = ref('')
const roleFilter   = ref('')
const statusFilter = ref('')

const members = [
  { name: 'jeniffer.solano@sanas.ai',     email: 'jeniffer.solano@sanas.ai',     status: 'activated',       date: '10 Mar 2026', creator: 'Carlos Mejia',                access: 'Sanas Admin' },
  { name: 'Mallikarjuna.c@sanas.ai',      email: 'mallikarjuna.c@sanas.ai',      status: 'activated',       date: '10 Mar 2026', creator: 'Kushant Gang',                access: 'Sanas Admin' },
  { name: 'pratyaksha.joshi+01@sanas.ai', email: 'pratyaksha.joshi+01@sanas.ai', status: 'deactivated',     date: '10 Mar 2026', creator: 'Kushant Gang',                access: '' },
  { name: 'arvin@sanas.ai',               email: 'arvin@sanas.ai',               status: 'activated',       date: '9 Mar 2026',  creator: 'zupudi.uday@sanas.ai',        access: 'Sanas Admin' },
  { name: 'harshith.kumar1@sanas.ai',     email: 'harshith.kumar1@sanas.ai',     status: 'activated',       date: '9 Mar 2026',  creator: 'Harshith Gowda',              access: 'Sanas User' },
  { name: 'ronak.giri@sanas.ai',          email: 'ronak.giri@sanas.ai',          status: 'activated',       date: '24 Feb 2026', creator: 'zupudi.uday@sanas.ai',        access: 'Sanas Admin' },
  { name: 'john.hong@sanas.ai',           email: 'john.hong@sanas.ai',           status: 'activated',       date: '24 Feb 2026', creator: 'peter.venugoyen.01@sanas.ai', access: 'Sanas Admin' },
  { name: 'katherine.butalapei@sanas.ai', email: 'katherine.butalapei@sanas.ai', status: 'invitation-sent', date: '20 Feb 2026', creator: 'Harshith Gowda',              access: 'Sanas Admin' },
  { name: 'inderpreet.singh@sanas.ai',    email: 'inderpreet.singh@sanas.ai',    status: 'activated',       date: '20 Feb 2026', creator: 'Harshith Gowda',              access: 'Sanas Admin' },
  { name: 'vikash.kumar@sanas.ai',        email: 'vikash.kumar@sanas.ai',        status: 'activated',       date: '20 Feb 2026', creator: 'Harshith Gowda',              access: 'Sanas Admin' },
]

const filteredMembers = computed(() =>
  members.filter(m => {
    const q = searchQuery.value.toLowerCase()
    return (
      (!q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)) &&
      (!roleFilter.value || m.access === roleFilter.value) &&
      (!statusFilter.value || m.status === statusFilter.value)
    )
  })
)
</script>
