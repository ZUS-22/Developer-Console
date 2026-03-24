<template>
  <AppLayout active-id="users">
    <!-- Page Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="font-display text-[22px] font-bold text-white leading-tight">Console Users</h1>
        <p class="text-g3 text-sm mt-1">Manage user access, roles, and permissions across your account.</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center justify-between mb-5 gap-3">
      <!-- Left: search + filters -->
      <div class="flex items-center gap-3 flex-1">
        <!-- Search -->
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-g4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or email"
            class="pl-8 pr-4 py-[6px] bg-card2 border border-border2 rounded-rxs text-sm text-white placeholder-g4 w-64 focus:border-grn/40 outline-none transition-colors"
          />
        </div>
        <!-- Role filter -->
        <select
          v-model="roleFilter"
          class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none appearance-none cursor-pointer pr-8 transition-colors"
          :style="selectChevronStyle"
        >
          <option value="">All Roles</option>
          <option value="account-admin">Account Admin</option>
          <option value="group-admin">Group Admin</option>
          <option value="member">Member</option>
        </select>
        <!-- Status filter -->
        <select
          v-model="statusFilter"
          class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none appearance-none cursor-pointer pr-8 transition-colors"
          :style="selectChevronStyle"
        >
          <option value="">All Status</option>
          <option value="activated">Active</option>
          <option value="invitation-sent">Invited</option>
          <option value="deactivated">Deactivated</option>
        </select>
      </div>
      <!-- Invite button -->
      <button
        @click="openInviteModal"
        class="bg-grn text-black hover:bg-grn/90 rounded-rxs px-3 py-[6px] text-xs font-medium inline-flex items-center gap-[5px] transition-colors"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Invite Users
      </button>
    </div>

    <!-- Table -->
    <div class="bg-card border border-border1 rounded-r overflow-hidden">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-border1">
            <th class="text-left px-4 py-3 text-[11px] font-medium text-g4 uppercase tracking-wider">Name</th>
            <th class="text-left px-4 py-3 text-[11px] font-medium text-g4 uppercase tracking-wider">Email</th>
            <th class="text-left px-4 py-3 text-[11px] font-medium text-g4 uppercase tracking-wider">Role &amp; Access Scope</th>
            <th class="text-left px-4 py-3 text-[11px] font-medium text-g4 uppercase tracking-wider">Status</th>
            <th class="text-left px-4 py-3 text-[11px] font-medium text-g4 uppercase tracking-wider">Created On</th>
            <th class="text-left px-4 py-3 text-[11px] font-medium text-g4 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="border-b border-border1 last:border-0 hover:bg-card2/50 transition-colors"
          >
            <!-- Name -->
            <td class="px-4 py-3.5 text-sm font-medium text-white whitespace-nowrap">{{ user.name }}</td>

            <!-- Email -->
            <td class="px-4 py-3.5 text-sm text-g3 font-mono">{{ user.email }}</td>

            <!-- Role & Access Scope -->
            <td class="px-4 py-3.5">
              <div class="flex flex-col gap-1.5">
                <div
                  v-for="(rs, idx) in (expandedRows.includes(user.id) ? user.roleScopes : user.roleScopes.slice(0, 2))"
                  :key="idx"
                  class="flex items-center gap-1.5 flex-wrap"
                >
                  <span :class="['inline-block px-[6px] py-[2px] rounded text-[10px] font-medium', roleBadgeClass(rs.role)]">
                    {{ roleLabel(rs.role) }}
                  </span>
                  <span class="text-g5 text-xs">·</span>
                  <span class="text-xs text-g3">{{ rs.scope }}</span>
                </div>
                <!-- +N more toggle -->
                <button
                  v-if="user.roleScopes.length > 2"
                  @click="toggleExpandRow(user.id)"
                  class="text-[11px] text-grn hover:text-grn/80 text-left mt-0.5 cursor-pointer"
                >
                  {{ expandedRows.includes(user.id) ? 'Show less' : `+${user.roleScopes.length - 2} more` }}
                </button>
              </div>
            </td>

            <!-- Status -->
            <td class="px-4 py-3.5">
              <StatusBadge :value="user.status" />
            </td>

            <!-- Created On -->
            <td class="px-4 py-3.5 text-sm text-g3 font-mono whitespace-nowrap">{{ formatDate(user.createdOn) }}</td>

            <!-- Actions -->
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-2">
                <button
                  @click="openEditModal(user)"
                  class="bg-transparent text-g2 border border-border2 hover:bg-card hover:text-white rounded-rxs px-3 py-[6px] text-xs font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  v-if="user.status === 'invitation-sent'"
                  class="bg-transparent text-g3 border border-border2 hover:bg-card hover:text-white rounded-rxs px-3 py-[6px] text-xs font-medium transition-colors"
                >
                  Resend
                </button>
                <button
                  v-if="user.status === 'activated'"
                  @click="deactivateUser(user)"
                  class="bg-red1/10 text-red1 border border-red1/[0.18] hover:bg-red1/[0.18] rounded-rxs px-2 py-1 text-[11px] font-mono transition-colors"
                >
                  Deactivate
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="6" class="px-4 py-10 text-center text-g4 text-sm">No users found</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination footer -->
      <div class="flex items-center justify-end gap-4 px-4 py-3 border-t border-border1">
        <div class="flex items-center gap-2 text-sm text-g4">
          <span>Rows per page:</span>
          <select class="bg-card2 border border-border1 rounded-rxs px-2 py-1 text-xs text-g2 focus:outline-none">
            <option>10</option><option>25</option><option>50</option>
          </select>
        </div>
        <span class="text-sm text-g4 font-mono">1–{{ filteredUsers.length }} of {{ filteredUsers.length }}</span>
        <div class="flex gap-1">
          <button class="w-7 h-7 border border-border1 bg-card2 rounded-rxs text-g4 opacity-50 cursor-not-allowed text-xs">&#8249;</button>
          <button class="w-7 h-7 border border-border1 bg-card2 rounded-rxs text-g4 opacity-50 cursor-not-allowed text-xs">&#8250;</button>
        </div>
      </div>
    </div>

    <!-- ===== INVITE USER MODAL ===== -->
    <AppModal v-model="showInviteModal">
      <template #title>Invite User</template>

      <!-- Email -->
      <div class="mb-5">
        <label class="block text-xs font-medium text-g3 mb-2">Email Address</label>
        <input
          v-model="inviteEmail"
          type="email"
          placeholder="user@example.com"
          class="w-full px-3 py-2.5 bg-card2 border border-border2 rounded-rxs text-sm text-white placeholder-g5 focus:border-grn/40 outline-none transition-colors"
        />
      </div>

      <!-- Role + Scope rows -->
      <div class="mb-4">
        <label class="block text-xs font-medium text-g3 mb-2">Role &amp; Scope</label>
        <div class="space-y-3">
          <div
            v-for="(row, idx) in inviteRoleScopes"
            :key="idx"
            class="grid grid-cols-[1fr_1fr_auto] gap-3 items-center"
          >
            <select
              v-model="row.role"
              class="px-3 py-2 bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none appearance-none transition-colors"
              :style="selectChevronStyle"
            >
              <option value="account-admin">Account Admin</option>
              <option value="group-admin">Group Admin</option>
              <option value="member">Member</option>
            </select>
            <select
              v-model="row.scope"
              class="px-3 py-2 bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none appearance-none transition-colors"
              :style="selectChevronStyle"
            >
              <option value="Production">Production</option>
              <option value="Staging">Staging</option>
              <option value="UAT">UAT</option>
              <option value="OnePlus">OnePlus</option>
              <option value="Real Me">Real Me</option>
              <option value="OnePay">OnePay</option>
            </select>
            <button
              v-if="inviteRoleScopes.length > 1"
              @click="inviteRoleScopes.splice(idx, 1)"
              class="w-7 h-7 flex items-center justify-center rounded-rxs bg-red1/10 border border-red1/[0.18] text-red1 hover:bg-red1/[0.18] transition-colors text-sm font-bold"
            >×</button>
            <div v-else class="w-7"></div>
          </div>
        </div>
        <button
          @click="inviteRoleScopes.push({ role: 'member', scope: 'Production' })"
          class="mt-3 px-3 py-[6px] bg-transparent border border-border2 rounded-rxs text-xs text-g3 hover:text-white hover:border-border1 transition-colors"
        >
          + Add another role
        </button>
      </div>

      <template #footer>
        <button
          @click="showInviteModal = false"
          class="bg-transparent text-g2 border border-border2 hover:bg-card hover:text-white rounded-rxs px-3 py-[6px] text-xs font-medium transition-colors"
        >Cancel</button>
        <button
          @click="sendInvitation"
          class="bg-grn text-black hover:bg-grn/90 rounded-rxs px-3 py-[6px] text-xs font-medium inline-flex items-center gap-[5px] transition-colors"
        >Send Invitation</button>
      </template>
    </AppModal>

    <!-- ===== EDIT ACCESS MODAL ===== -->
    <AppModal v-model="showEditModal">
      <template #title>Edit Access</template>

      <div v-if="editingUser" class="mb-1">
        <p class="text-sm text-g3 mb-5">
          Editing access for <span class="text-white font-medium">{{ editingUser.name }}</span>
        </p>

        <label class="block text-xs font-medium text-g3 mb-2">Role &amp; Scope Assignments</label>
        <div class="space-y-3 mb-3">
          <div
            v-for="(row, idx) in editRoleScopes"
            :key="idx"
            class="grid grid-cols-[1fr_1fr_auto] gap-3 items-center"
          >
            <select
              v-model="row.role"
              class="px-3 py-2 bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none appearance-none transition-colors"
              :style="selectChevronStyle"
            >
              <option value="account-admin">Account Admin</option>
              <option value="group-admin">Group Admin</option>
              <option value="member">Member</option>
            </select>
            <select
              v-model="row.scope"
              class="px-3 py-2 bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none appearance-none transition-colors"
              :style="selectChevronStyle"
            >
              <option value="Production">Production</option>
              <option value="Staging">Staging</option>
              <option value="UAT">UAT</option>
              <option value="OnePlus">OnePlus</option>
              <option value="Real Me">Real Me</option>
              <option value="OnePay">OnePay</option>
              <option value="Account Level">Account Level</option>
              <option value="French-Danish">French-Danish</option>
              <option value="French-Spanish">French-Spanish</option>
              <option value="French-Italian">French-Italian</option>
              <option value="Default Group">Default Group</option>
              <option value="Spanish-English">Spanish-English</option>
              <option value="German-French">German-French</option>
            </select>
            <button
              v-if="editRoleScopes.length > 1"
              @click="editRoleScopes.splice(idx, 1)"
              class="w-7 h-7 flex items-center justify-center rounded-rxs bg-red1/10 border border-red1/[0.18] text-red1 hover:bg-red1/[0.18] transition-colors text-sm font-bold"
            >×</button>
            <div v-else class="w-7"></div>
          </div>
        </div>

        <button
          @click="editRoleScopes.push({ role: 'member', scope: 'Production' })"
          class="px-3 py-[6px] bg-transparent border border-border2 rounded-rxs text-xs text-g3 hover:text-white hover:border-border1 transition-colors"
        >
          + Add Role
        </button>
      </div>

      <template #footer>
        <button
          @click="showEditModal = false"
          class="bg-transparent text-g2 border border-border2 hover:bg-card hover:text-white rounded-rxs px-3 py-[6px] text-xs font-medium transition-colors"
        >Cancel</button>
        <button
          @click="saveAccessChanges"
          class="bg-grn text-black hover:bg-grn/90 rounded-rxs px-3 py-[6px] text-xs font-medium inline-flex items-center gap-[5px] transition-colors"
        >Save Changes</button>
      </template>
    </AppModal>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import AppModal from '../components/AppModal.vue'
import StatusBadge from '../components/StatusBadge.vue'

// Chevron style for select dropdowns
const selectChevronStyle = {
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: '28px',
}

// ---- Users data ----
const users = ref([
  {
    id: 1,
    name: 'Zupudi Uday',
    email: 'zupudi.uday@sanas.ai',
    roleScopes: [{ role: 'account-admin', scope: 'Account Level' }],
    status: 'activated',
    createdOn: '2026-03-15',
  },
  {
    id: 2,
    name: 'Carlos Mejia',
    email: 'carlos.mejia@sanas.ai',
    roleScopes: [
      { role: 'group-admin', scope: 'French-Danish' },
      { role: 'group-admin', scope: 'French-Spanish' },
      { role: 'member', scope: 'French-Italian' },
    ],
    status: 'activated',
    createdOn: '2026-03-14',
  },
  {
    id: 3,
    name: 'Kushant Gang',
    email: 'kushant.gang@sanas.ai',
    roleScopes: [{ role: 'member', scope: 'French-Italian' }],
    status: 'invitation-sent',
    createdOn: '2026-03-13',
  },
  {
    id: 4,
    name: 'Harshith Gowda',
    email: 'harshith.gowda@sanas.ai',
    roleScopes: [
      { role: 'group-admin', scope: 'French-Danish' },
      { role: 'member', scope: 'French-Spanish' },
      { role: 'member', scope: 'French-Italian' },
      { role: 'member', scope: 'Default Group' },
      { role: 'group-admin', scope: 'Spanish-English' },
      { role: 'member', scope: 'German-French' },
    ],
    status: 'activated',
    createdOn: '2026-03-12',
  },
  {
    id: 5,
    name: 'John Smith',
    email: 'john.smith@sanas.ai',
    roleScopes: [{ role: 'group-admin', scope: 'French-Danish' }],
    status: 'invitation-sent',
    createdOn: '2026-03-10',
  },
  {
    id: 6,
    name: 'Jane Doe',
    email: 'jane.doe@sanas.ai',
    roleScopes: [{ role: 'member', scope: 'French-Spanish' }],
    status: 'deactivated',
    createdOn: '2026-03-08',
  },
])

// ---- Filters ----
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    const matchesRole =
      !roleFilter.value ||
      u.roleScopes.some(rs => rs.role === roleFilter.value)
    const matchesStatus = !statusFilter.value || u.status === statusFilter.value
    return matchesSearch && matchesRole && matchesStatus
  })
})

// ---- Expand rows ----
const expandedRows = ref([])

function toggleExpandRow(id) {
  const idx = expandedRows.value.indexOf(id)
  if (idx >= 0) {
    expandedRows.value.splice(idx, 1)
  } else {
    expandedRows.value.push(id)
  }
}

// ---- Role helpers ----
function roleLabel(role) {
  const map = {
    'account-admin': 'Account Admin',
    'group-admin': 'Group Admin',
    'member': 'Member',
  }
  return map[role] ?? role
}

function roleBadgeClass(role) {
  const map = {
    'account-admin': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    'group-admin': 'bg-grn/10 text-grn border border-grn/20',
    'member': 'bg-card2 text-g3 border border-border2',
  }
  return map[role] ?? 'bg-card2 text-g3 border border-border2'
}

// ---- Date format ----
function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ---- Deactivate ----
function deactivateUser(user) {
  if (window.confirm(`Are you sure you want to deactivate ${user.name}?`)) {
    user.status = 'deactivated'
  }
}

// ---- Invite Modal ----
const showInviteModal = ref(false)
const inviteEmail = ref('')
const inviteRoleScopes = ref([{ role: 'member', scope: 'Production' }])

function openInviteModal() {
  inviteEmail.value = ''
  inviteRoleScopes.value = [{ role: 'member', scope: 'Production' }]
  showInviteModal.value = true
}

let nextId = 7

function sendInvitation() {
  if (!inviteEmail.value.trim()) return
  const name = inviteEmail.value.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  users.value.push({
    id: nextId++,
    name,
    email: inviteEmail.value.trim(),
    roleScopes: inviteRoleScopes.value.map(r => ({ ...r })),
    status: 'invitation-sent',
    createdOn: new Date().toISOString().split('T')[0],
  })
  showInviteModal.value = false
}

// ---- Edit Modal ----
const showEditModal = ref(false)
const editingUser = ref(null)
const editRoleScopes = ref([])

function openEditModal(user) {
  editingUser.value = user
  editRoleScopes.value = user.roleScopes.map(r => ({ ...r }))
  showEditModal.value = true
}

function saveAccessChanges() {
  if (!editingUser.value) return
  editingUser.value.roleScopes = editRoleScopes.value.map(r => ({ ...r }))
  showEditModal.value = false
  editingUser.value = null
}
</script>
