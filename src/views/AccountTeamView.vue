<template>
  <AccountLayout
    :account-id="accountId"
    :account-name="accountName"
    active-nav="team"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="font-display text-[22px] font-bold text-white leading-tight">Team</h1>
        <p class="text-g3 text-sm mt-1">Manage team members and roles for this account.</p>
      </div>
      <button
        @click="showInviteForm = true"
        class="bg-grn text-black hover:bg-grn/90 rounded-rxs px-3 py-[6px] text-xs font-medium inline-flex items-center gap-[5px] transition-colors"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Invite Member
      </button>
    </div>

    <!-- Invite form -->
    <div v-if="showInviteForm" class="bg-card border border-border1 rounded-r p-4 mb-5">
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label class="block text-xs font-medium text-g3 mb-1.5">Email</label>
          <input v-model="inviteEmail" type="email" placeholder="user@example.com"
            class="w-full px-3 py-2 bg-card2 border border-border2 rounded-rxs text-sm text-white placeholder-g5 focus:border-grn/40 outline-none transition-colors" />
        </div>
        <div>
          <label class="block text-xs font-medium text-g3 mb-1.5">Role</label>
          <select v-model="inviteRole"
            class="w-full px-3 py-2 bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none appearance-none cursor-pointer transition-colors">
            <option value="account-admin">Account Admin</option>
            <option value="group-admin">Group Admin</option>
            <option value="member">Member</option>
          </select>
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="showInviteForm = false; inviteEmail = ''; inviteRole = 'member'"
          class="bg-transparent text-g2 border border-border2 hover:bg-card hover:text-white rounded-rxs px-3 py-[6px] text-xs font-medium transition-colors">Cancel</button>
        <button @click="sendInvite"
          class="bg-grn text-black hover:bg-grn/90 rounded-rxs px-3 py-[6px] text-xs font-medium transition-colors">Send Invite</button>
      </div>
    </div>

    <!-- Members table -->
    <div class="bg-card border border-border1 rounded-r overflow-hidden">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-border1">
            <th class="text-left px-4 py-3 text-[10px] font-mono text-g4 uppercase tracking-wider">Name</th>
            <th class="text-left px-4 py-3 text-[10px] font-mono text-g4 uppercase tracking-wider">Email</th>
            <th class="text-left px-4 py-3 text-[10px] font-mono text-g4 uppercase tracking-wider">Role</th>
            <th class="text-left px-4 py-3 text-[10px] font-mono text-g4 uppercase tracking-wider">Status</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in members" :key="member.id" class="border-b border-border1 last:border-0 hover:bg-card2 transition-colors">
            <td class="px-4 py-3 text-sm text-white">{{ member.name }}</td>
            <td class="px-4 py-3 text-xs text-g3 font-mono">{{ member.email }}</td>
            <td class="px-4 py-3">
              <span :class="roleBadge(member.role)">{{ roleLabel(member.role) }}</span>
            </td>
            <td class="px-4 py-3">
              <span :class="statusBadge(member.status)">{{ member.status }}</span>
            </td>
            <td class="px-4 py-3 text-right">
              <button @click="removeMember(member.id)"
                class="text-g5 hover:text-red1 text-xs transition-colors">Remove</button>
            </td>
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

const showInviteForm = ref(false)
const inviteEmail    = ref('')
const inviteRole     = ref('member')

const members = ref([
  { id: 1, name: 'Jordan Lee',   email: 'jordan@acme.com',  role: 'account-admin', status: 'Active' },
  { id: 2, name: 'Sam Rivera',   email: 'sam@acme.com',     role: 'group-admin',   status: 'Active' },
  { id: 3, name: 'Alex Chen',    email: 'alex@acme.com',    role: 'member',        status: 'Invited' },
])
let nextId = 4

function sendInvite() {
  if (!inviteEmail.value.trim()) return
  members.value.push({
    id: nextId++,
    name: inviteEmail.value.split('@')[0],
    email: inviteEmail.value.trim(),
    role: inviteRole.value,
    status: 'Invited',
  })
  showInviteForm.value = false
  inviteEmail.value = ''
  inviteRole.value = 'member'
}

function removeMember(id) {
  members.value = members.value.filter(m => m.id !== id)
}

const roleLabels = { 'account-admin': 'Account Admin', 'group-admin': 'Group Admin', 'member': 'Member' }
function roleLabel(role) { return roleLabels[role] || role }
function roleBadge(role) {
  const base = 'inline-flex px-2 py-[2px] rounded text-[10px] font-medium font-mono'
  if (role === 'account-admin') return base + ' bg-grn/10 text-grn border border-grn/20'
  if (role === 'group-admin')   return base + ' bg-pur/10 text-pur border border-pur/20'
  return base + ' bg-card2 text-g3 border border-border2'
}
function statusBadge(status) {
  const base = 'inline-flex px-2 py-[2px] rounded text-[10px] font-medium font-mono'
  if (status === 'Active') return base + ' bg-grn/10 text-grn border border-grn/20'
  return base + ' bg-amb/10 text-amb border border-amb/20'
}
</script>
