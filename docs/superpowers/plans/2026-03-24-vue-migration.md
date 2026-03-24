# Vue.js Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert 7 standalone HTML prototype files into a modular Vue 3 single-page application using Vite and Tailwind CSS, preserving all existing visual design and interactivity exactly.

**Architecture:** Vue Router manages navigation between 7 views (one per original page). Six shared components handle the sidebar, layout, header, table, badges, and modals. All CSS is replaced with Tailwind utility classes; a small global CSS file handles animations that Tailwind cannot express.

**Tech Stack:** Vite, Vue 3 (Composition API), Vue Router 4, Tailwind CSS 3, Chart.js (usage page)

**Reference:** Original HTML files will be archived to `html-originals/` in Task 1 Step 1. When implementing views (Tasks 7–13), read from `html-originals/` for exact markup, data, and behavior.

---

## File Map

**New files to create:**
- `index.html` — Vite entry point (replaces original)
- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `package.json`
- `src/main.js`
- `src/App.vue`
- `src/assets/main.css`
- `src/router/index.js`
- `src/components/AppLayout.vue` — sidebar + main area wrapper for all dashboard pages
- `src/components/AppSidebar.vue` — ◆ logo, search, expandable nav items
- `src/components/AppHeader.vue` — top tab bar (Home / Accounts / Sanas Members), icon buttons, user info
- `src/components/DataTable.vue` — **intentionally skipped**: each view inlines its own table directly since columns/rows differ enough per page that a generic component adds complexity without reducing duplication. The component file is not created.
- `src/components/StatusBadge.vue` — color-coded badge for status/role values
- `src/components/AppModal.vue` — modal overlay with header/body/footer slots
- `src/views/LoginView.vue`
- `src/views/AccountsView.vue`
- `src/views/ApiKeysView.vue`
- `src/views/MembersView.vue`
- `src/views/UsersView.vue`
- `src/views/UsageView.vue`
- `src/views/AccountDetailView.vue`

**Files to move:**
- All `*.html` at root → `html-originals/`

**Files to update:**
- `README.md`
- `REQUIREMENTS.md`

---

## Task 1: Archive originals and scaffold project

**Files:**
- Move: `*.html` → `html-originals/`
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.js`, `src/App.vue`, `src/assets/main.css`

- [ ] **Step 1: Move original HTML files to archive folder**

```bash
mkdir -p html-originals
mv accounts.html api-keys.html members.html users.html usage.html account-detail.html index.html html-originals/
```

- [ ] **Step 2: Initialize Vite project in place**

```bash
npm create vite@latest . -- --template vue --force
```
When prompted "Current directory is not empty. Remove existing files and continue?" → select **No, keep existing files** (or pass `--force` to merge). Accept defaults.

- [ ] **Step 3: Install dependencies**

```bash
npm install
npm install -D tailwindcss@3 postcss autoprefixer
npm install vue-router@4
npm install chart.js
npx tailwindcss init -p
```

- [ ] **Step 4: Configure tailwind.config.js**

Replace the generated file content with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        'console-dark':    '#0a0e17',
        'console-sidebar': '#13182b',
        'console-border':  '#1e2847',
        'cyan-accent':     '#00d9ff',
        'green-accent':    '#00ff88',
        'console-text':    '#e4e7f0',
        'text-muted':      '#8b95b0',
        'text-dim':        '#5a6b8c',
      },
      fontFamily: {
        mono: ["'SF Mono'", "'Monaco'", "'Menlo'", "'Consolas'", 'monospace'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Write src/assets/main.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Grid background animation — not expressible in Tailwind */
.grid-bg::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 217, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 0;
}

/* Login page grid scrolls */
.grid-bg-scroll::before {
  animation: gridScroll 20s linear infinite;
  opacity: 0.6;
}

@keyframes gridScroll {
  0%   { transform: translateY(0); }
  100% { transform: translateY(50px); }
}

/* Logo pulse glow */
@keyframes logoPulse {
  0%, 100% { box-shadow: 0 0 32px rgba(0,217,255,0.6), 0 0 64px rgba(0,255,136,0.3); }
  50%       { box-shadow: 0 0 48px rgba(0,217,255,0.8), 0 0 96px rgba(0,255,136,0.5); }
}

.logo-pulse {
  animation: logoPulse 3s ease-in-out infinite;
}

/* Cyan glow utility */
.glow-cyan {
  box-shadow: 0 0 12px rgba(0, 217, 255, 0.3);
}
```

- [ ] **Step 6: Write src/main.js**

```js
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './assets/main.css'

import LoginView        from './views/LoginView.vue'
import AccountsView     from './views/AccountsView.vue'
import ApiKeysView      from './views/ApiKeysView.vue'
import MembersView      from './views/MembersView.vue'
import UsersView        from './views/UsersView.vue'
import UsageView        from './views/UsageView.vue'
import AccountDetailView from './views/AccountDetailView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',               component: LoginView },
    { path: '/home',           redirect: '/accounts' },   // Header "Home" tab target
    { path: '/accounts',       component: AccountsView },
    { path: '/accounts/:id',   component: AccountDetailView },
    { path: '/api-keys',       component: ApiKeysView },
    { path: '/members',        component: MembersView },
    { path: '/users',          component: UsersView },
    { path: '/usage',          component: UsageView },
  ],
})

createApp(App).use(router).mount('#app')
```

- [ ] **Step 7: Write src/App.vue**

```vue
<template>
  <RouterView />
</template>
```

- [ ] **Step 8: Update Vite's index.html**

The generated `index.html` should already reference `src/main.js`. Verify it has:
```html
<script type="module" src="/src/main.js"></script>
```
And set the title to `Sanas Developer Console`.

- [ ] **Step 9: Start dev server and verify it runs**

```bash
npm run dev
```
Expected: server starts at `http://localhost:5173`. Browser shows a blank page (no views yet). No build errors in terminal.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + Vue 3 + Tailwind CSS project"
```

---

## Task 2: StatusBadge component

**Files:**
- Create: `src/components/StatusBadge.vue`

StatusBadge renders a colored pill badge. Used for: API key status (Active/Expiring/Expired), user status (Active/Invited/Deactivated), roles (Account Admin/Group Admin/Member), billing plans (Self Hosted SDK/Sanas Cloud SDK), member status (Activated/Deactivated/Invitation Sent).

- [ ] **Step 1: Create src/components/StatusBadge.vue**

```vue
<template>
  <span :class="['inline-block px-2.5 py-1 rounded text-xs font-medium', colorClass]">
    {{ label }}
  </span>
</template>

<script setup>
const props = defineProps({
  value: { type: String, required: true },
})

const colorMap = {
  // API key status
  active:          'bg-emerald-900/40 text-emerald-400 border border-emerald-700/50',
  expiring:        'bg-yellow-900/40 text-yellow-400 border border-yellow-700/50',
  expired:         'bg-red-900/40 text-red-400 border border-red-700/50',
  // User/member status
  activated:       'bg-blue-900/40 text-blue-400 border border-blue-700/50',
  deactivated:     'bg-gray-800 text-gray-400 border border-gray-700',
  'invitation-sent': 'bg-indigo-900/40 text-indigo-400 border border-indigo-700/50',
  invited:         'bg-indigo-900/40 text-indigo-400 border border-indigo-700/50',
  // Roles
  'account admin': 'bg-purple-900/40 text-purple-400 border border-purple-700/50',
  'group admin':   'bg-cyan-900/40 text-cyan-400 border border-cyan-700/50',
  member:          'bg-gray-800 text-gray-400 border border-gray-700',
  // Billing plans
  'self hosted sdk':  'bg-blue-900/40 text-blue-300 border border-blue-700/50',
  'sanas cloud sdk':  'bg-teal-900/40 text-teal-300 border border-teal-700/50',
  // Deployment
  cloud:           'bg-sky-900/40 text-sky-400 border border-sky-700/50',
  'self-hosted':   'bg-orange-900/40 text-orange-400 border border-orange-700/50',
  // Members light theme
  'sanas admin':   'bg-blue-100 text-blue-700',
  'sanas user':    'bg-green-100 text-green-700',
}

const label = props.value.charAt(0).toUpperCase() + props.value.slice(1).replace(/-/g, ' ')
const colorClass = colorMap[props.value.toLowerCase()] ?? 'bg-gray-700 text-gray-300'
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StatusBadge.vue
git commit -m "feat: add StatusBadge component"
```

---

## Task 3: AppModal component

**Files:**
- Create: `src/components/AppModal.vue`

Generic modal overlay. Used on Accounts (create account) and API Keys (create key) pages.

- [ ] **Step 1: Create src/components/AppModal.vue**

```vue
<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center"
      @click.self="$emit('update:modelValue', false)"
    >
      <div class="bg-console-sidebar border border-console-border rounded-xl w-[90%] max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(0,217,255,0.2)]">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-console-border bg-cyan-accent/5">
          <h2 class="text-lg font-bold text-cyan-accent uppercase tracking-widest">
            <slot name="title" />
          </h2>
          <button
            class="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:bg-gray-700 hover:text-white text-2xl leading-none"
            @click="$emit('update:modelValue', false)"
          >&times;</button>
        </div>
        <!-- Body -->
        <div class="p-6">
          <slot />
        </div>
        <!-- Footer -->
        <div v-if="$slots.footer" class="flex items-center justify-between px-6 py-4 border-t border-console-border">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({ modelValue: Boolean })
defineEmits(['update:modelValue'])
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AppModal.vue
git commit -m "feat: add AppModal component"
```

---

## Task 4: AppSidebar component

**Files:**
- Create: `src/components/AppSidebar.vue`

The sidebar appears on all dashboard pages (not login). Shows: hamburger, ◆ SANAS logo, search input, and a list of nav items (Sanas / Direct CX / Self Serve) with chevrons and active state.

- [ ] **Step 1: Create src/components/AppSidebar.vue**

```vue
<template>
  <aside class="w-[260px] bg-console-sidebar border-r border-console-border flex flex-col shadow-[2px_0_20px_rgba(0,0,0,0.5)] shrink-0">
    <!-- Header -->
    <div class="flex items-center gap-3 p-4 border-b border-console-border bg-cyan-accent/[0.03]">
      <div class="flex flex-col gap-[3px] w-5 h-5 cursor-pointer">
        <span class="w-full h-[2px] bg-cyan-accent block"></span>
        <span class="w-full h-[2px] bg-cyan-accent block"></span>
        <span class="w-full h-[2px] bg-cyan-accent block"></span>
      </div>
      <div class="font-mono font-bold text-base text-cyan-accent uppercase tracking-widest">
        <span class="text-green-accent mr-1" style="filter: drop-shadow(0 0 8px #00ff88)">◆</span>sanas
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex-1">
      <input
        v-model="search"
        type="text"
        placeholder="Search Groups..."
        class="w-full px-3 py-2 bg-console-dark border border-console-border rounded text-sm text-console-text font-mono placeholder-text-dim focus:outline-none focus:border-cyan-accent focus:shadow-[0_0_12px_rgba(0,217,255,0.3)] mb-4"
      />

      <template v-for="item in navItems" :key="item.id">
        <div
          :class="[
            'flex items-center justify-between px-3 py-2.5 mb-1 rounded cursor-pointer text-sm border transition-all duration-200',
            activeId === item.id
              ? 'bg-cyan-accent/10 border-cyan-accent text-cyan-accent shadow-[0_0_12px_rgba(0,217,255,0.2)]'
              : 'border-transparent text-text-muted hover:bg-cyan-accent/5 hover:border-cyan-accent/20 hover:text-console-text'
          ]"
          @click="$emit('select', item.id)"
        >
          <div class="flex items-center gap-2">
            <span class="text-xs">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </div>
          <span class="text-gray-400 text-xs">›</span>
        </div>
        <div v-if="item.subtitle" class="text-[11px] text-text-dim font-mono uppercase tracking-wide px-3 pb-2">
          {{ item.subtitle }}
        </div>
      </template>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  activeId: { type: String, default: 'sanas' },
})
defineEmits(['select'])

const search = ref('')

const navItems = [
  { id: 'sanas',    icon: '📊', label: 'Sanas',    subtitle: 'Account ID: SANAS' },
  { id: 'directcx', icon: '📍', label: 'Direct CX' },
  { id: 'selfserve', icon: '🔧', label: 'Self Serve' },
]
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AppSidebar.vue
git commit -m "feat: add AppSidebar component"
```

---

## Task 5: AppHeader component

**Files:**
- Create: `src/components/AppHeader.vue`

Top navigation bar with three tabs (Home / Accounts / Sanas Members), notification/help icon buttons, and user info text. Active tab is highlighted with a cyan bottom border.

- [ ] **Step 1: Create src/components/AppHeader.vue**

```vue
<template>
  <header class="bg-console-sidebar border-b border-console-border px-8 flex justify-between items-center h-[60px] shadow-[0_2px_20px_rgba(0,0,0,0.3)] shrink-0">
    <nav class="flex gap-8 h-full">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        :class="[
          'flex items-center gap-1.5 text-sm font-medium border-b-2 transition-all duration-200 px-1 no-underline',
          $route.path.startsWith(tab.to) && tab.to !== '/'
            ? 'text-cyan-accent border-cyan-accent [text-shadow:0_0_12px_rgba(0,217,255,0.5)]'
            : 'text-text-muted border-transparent hover:text-cyan-accent'
        ]"
      >
        <span class="text-base">{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
      </RouterLink>
    </nav>
    <div class="flex items-center gap-4">
      <button
        v-for="icon in ['🔔','❓']"
        :key="icon"
        class="w-9 h-9 rounded border border-console-border bg-console-dark flex items-center justify-center text-base text-text-muted hover:bg-cyan-accent/10 hover:border-cyan-accent hover:text-cyan-accent hover:shadow-[0_0_12px_rgba(0,217,255,0.3)] transition-all duration-200"
      >{{ icon }}</button>
      <span class="text-xs text-text-muted font-mono">Zupudi uday@sa...</span>
    </div>
  </header>
</template>

<script setup>
const tabs = [
  { to: '/home',     icon: '🏠', label: 'Home' },
  { to: '/accounts', icon: '📄', label: 'Accounts' },
  { to: '/members',  icon: '👥', label: 'Sanas Members' },
]
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AppHeader.vue
git commit -m "feat: add AppHeader component"
```

---

## Task 6: AppLayout component

**Files:**
- Create: `src/components/AppLayout.vue`

Wraps all authenticated dashboard pages. Renders: animated grid background, AppSidebar on the left, and a main column with AppHeader on top and a `<slot>` for page content below.

- [ ] **Step 1: Create src/components/AppLayout.vue**

```vue
<template>
  <div class="min-h-screen bg-console-dark text-console-text grid-bg relative">
    <div class="flex min-h-screen relative z-10">
      <AppSidebar :active-id="activeId" @select="$emit('sidebarSelect', $event)" />
      <div class="flex flex-col flex-1 min-w-0">
        <AppHeader />
        <main class="flex-1 p-8">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue'
import AppHeader  from './AppHeader.vue'

defineProps({
  activeId: { type: String, default: 'sanas' },
})
defineEmits(['sidebarSelect'])
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AppLayout.vue
git commit -m "feat: add AppLayout wrapper component"
```

---

## Task 7: LoginView

**Files:**
- Create: `src/views/LoginView.vue`

Reference: `html-originals/index.html` for exact markup and interaction.

Full-screen dark page with animated scrolling grid, centered card with pulsing logo, email input, gradient Continue button (disabled until valid email), "or" divider, Google sign-in button. On submit, navigate to `/accounts`.

- [ ] **Step 1: Create src/views/LoginView.vue**

```vue
<template>
  <div class="min-h-screen bg-console-dark flex items-center justify-center relative overflow-hidden grid-bg-scroll">
    <div class="relative z-10 w-full max-w-[440px] px-5">
      <div class="bg-console-sidebar border border-console-border rounded-3xl px-10 py-12 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(0,217,255,0.2)]">
        <!-- Logo -->
        <div class="w-12 h-12 mx-auto mb-6 bg-gradient-to-br from-cyan-accent to-green-accent rounded-xl flex items-center justify-center logo-pulse">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>

        <h1 class="text-2xl font-bold text-center text-console-text mb-2">Welcome to</h1>
        <h2 class="text-xl font-bold text-center text-cyan-accent mb-8 font-mono">Sanas Developer Console</h2>

        <!-- Email -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-text-muted mb-2">Email address</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@company.com"
            class="w-full px-4 py-3 bg-console-dark border border-console-border rounded-lg text-console-text font-mono text-sm focus:outline-none focus:border-cyan-accent focus:shadow-[0_0_12px_rgba(0,217,255,0.3)] transition-all"
            @keyup.enter="handleContinue"
          />
        </div>

        <!-- Continue button -->
        <button
          :disabled="!isValidEmail"
          :class="[
            'w-full py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 mb-4',
            isValidEmail
              ? 'bg-gradient-to-r from-cyan-accent to-green-accent text-console-dark hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(0,217,255,0.6)]'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          ]"
          @click="handleContinue"
        >Continue</button>

        <p class="text-center text-xs text-text-dim mb-4">
          By continuing you agree to our
          <a href="#" class="text-cyan-accent hover:underline">Terms of Use</a>
        </p>

        <!-- Divider -->
        <div class="flex items-center gap-3 mb-4">
          <div class="flex-1 h-px bg-console-border"></div>
          <span class="text-xs text-text-dim">or</span>
          <div class="flex-1 h-px bg-console-border"></div>
        </div>

        <!-- Google -->
        <button
          class="w-full py-3 border border-console-border rounded-lg text-sm text-text-muted flex items-center justify-center gap-3 hover:bg-cyan-accent/5 hover:border-cyan-accent/50 transition-all"
          @click="router.push('/accounts')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email  = ref('')
const isValidEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))

function handleContinue() {
  if (isValidEmail.value) router.push('/accounts')
}
</script>
```

- [ ] **Step 2: Start dev server and verify login page renders**

```bash
npm run dev
```
Navigate to `http://localhost:5173`. Expected: login card with logo, email input, and button visible. Grid background present. Button is gray when email is empty, gradient when a valid email is typed.

- [ ] **Step 3: Commit**

```bash
git add src/views/LoginView.vue
git commit -m "feat: add LoginView"
```

---

## Task 8: AccountsView

**Files:**
- Create: `src/views/AccountsView.vue`

Reference: `html-originals/accounts.html` for exact data, table structure, and modal form.

Shows table of accounts with: Account Name, Account ID (monospace), Account Admins (avatar initials), Parent Group, Billing Plans Access (badges), Created On, Created By, Actions (⋯ dropdown with Go to Account / Edit / Edit Subscriptions). Clicking a row or "Go to Account" navigates to `/accounts/:id`. Top toolbar: search input + billing plan filter dropdown + "Create Account" button that opens a modal.

- [ ] **Step 1: Create src/views/AccountsView.vue**

```vue
<template>
  <AppLayout>
    <h1 class="text-3xl font-bold text-console-text uppercase tracking-wide mb-6">Accounts</h1>

    <!-- Toolbar -->
    <div class="flex items-center justify-between mb-5">
      <div class="flex gap-3">
        <input
          v-model="search"
          type="text"
          placeholder="Search Account"
          class="w-[280px] pl-9 pr-3 py-2 bg-console-dark border border-console-border rounded text-sm text-console-text font-mono placeholder-text-dim focus:outline-none focus:border-cyan-accent focus:shadow-[0_0_12px_rgba(0,217,255,0.3)] bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%2200d9ff%22%20stroke-width%3D%222%22%3E%3Ccircle%20cx%3D%2211%22%20cy%3D%2211%22%20r%3D%228%22%2F%3E%3Cpath%20d%3D%22M21%2021l-4.35-4.35%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[left_12px_center]"
        />
        <select
          v-model="planFilter"
          class="px-3 py-2 bg-console-dark border border-console-border rounded text-sm text-console-text appearance-none cursor-pointer hover:border-cyan-accent transition-all"
        >
          <option value="">All Billing Plans</option>
          <option value="Self Hosted SDK">Self Hosted SDK</option>
          <option value="Sanas Cloud SDK">Sanas Cloud SDK</option>
        </select>
      </div>
      <button
        class="px-5 py-2 bg-gradient-to-r from-cyan-accent to-green-accent text-console-dark font-bold text-sm uppercase tracking-wide rounded hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] transition-all shadow-[0_0_20px_rgba(0,217,255,0.3)]"
        @click="showModal = true"
      >Create Account</button>
    </div>

    <!-- Table -->
    <div class="bg-console-sidebar rounded-lg border border-console-border overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(0,217,255,0.1)]">
      <table class="w-full border-collapse">
        <thead class="bg-cyan-accent/5 border-b border-cyan-accent">
          <tr>
            <th v-for="col in columns" :key="col" class="text-left px-4 py-3 text-[11px] font-bold text-cyan-accent uppercase tracking-[1.5px] font-mono border-b-2 border-console-border">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(acc, idx) in filteredAccounts"
            :key="acc.id"
            class="cursor-pointer border-l-2 border-l-transparent hover:bg-cyan-accent/5 hover:border-l-cyan-accent transition-all duration-200"
            @click="goToAccount(acc)"
          >
            <td class="px-4 py-3.5 text-sm border-b border-console-border text-console-text font-medium">{{ acc.name }}</td>
            <td class="px-4 py-3.5 text-sm border-b border-console-border font-mono text-cyan-accent/80">{{ acc.id }}</td>
            <td class="px-4 py-3.5 text-sm border-b border-console-border">
              <div class="flex gap-1">
                <div
                  v-for="a in acc.admins"
                  :key="a.init"
                  class="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold text-white"
                >{{ a.init }}</div>
              </div>
            </td>
            <td class="px-4 py-3.5 text-sm border-b border-console-border text-text-muted">{{ acc.parentGroup }}</td>
            <td class="px-4 py-3.5 text-sm border-b border-console-border">
              <div class="flex flex-wrap gap-1">
                <StatusBadge v-for="p in acc.plans" :key="p" :value="p" />
              </div>
            </td>
            <td class="px-4 py-3.5 text-sm border-b border-console-border text-text-muted">{{ acc.date }}</td>
            <td class="px-4 py-3.5 text-sm border-b border-console-border text-text-muted">{{ acc.creator }}</td>
            <td class="px-4 py-3.5 text-sm border-b border-console-border relative" @click.stop>
              <div class="relative">
                <button
                  class="w-8 h-8 flex items-center justify-center rounded border border-console-border text-text-muted hover:border-cyan-accent hover:text-cyan-accent transition-all"
                  @click="activeMenu = activeMenu === idx ? null : idx"
                >⋯</button>
                <div
                  v-if="activeMenu === idx"
                  class="absolute right-0 top-9 bg-console-sidebar border border-console-border rounded-lg shadow-xl z-20 w-48 py-1"
                >
                  <button class="w-full text-left px-4 py-2 text-sm text-console-text hover:bg-cyan-accent/10 hover:text-cyan-accent" @click="goToAccount(acc); activeMenu = null">Go to Account</button>
                  <button class="w-full text-left px-4 py-2 text-sm text-console-text hover:bg-cyan-accent/10 hover:text-cyan-accent" @click="activeMenu = null">Edit Account Details</button>
                  <button class="w-full text-left px-4 py-2 text-sm text-console-text hover:bg-cyan-accent/10 hover:text-cyan-accent" @click="activeMenu = null">Edit Subscriptions</button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Account Modal -->
    <AppModal v-model="showModal">
      <template #title>Create Account</template>
      <form class="space-y-5" @submit.prevent="createAccount">
        <div>
          <label class="block text-sm text-text-muted mb-1.5">Account Name</label>
          <input v-model="form.name" type="text" placeholder="Enter account name" required class="w-full px-3 py-2.5 bg-console-dark border border-console-border rounded text-sm text-console-text font-mono focus:outline-none focus:border-cyan-accent focus:bg-cyan-accent/5 focus:shadow-[0_0_12px_rgba(0,217,255,0.3)] transition-all" />
        </div>
        <div>
          <label class="block text-sm text-text-muted mb-1.5">Account Admin</label>
          <input v-model="form.admin" type="email" placeholder="admin@example.com" required class="w-full px-3 py-2.5 bg-console-dark border border-console-border rounded text-sm text-console-text font-mono focus:outline-none focus:border-cyan-accent focus:bg-cyan-accent/5 focus:shadow-[0_0_12px_rgba(0,217,255,0.3)] transition-all" />
        </div>
        <div>
          <label class="block text-sm text-text-muted mb-1.5">Parent Group</label>
          <select v-model="form.parentGroup" required class="w-full px-3 py-2.5 bg-console-dark border border-console-border rounded text-sm text-console-text font-mono focus:outline-none focus:border-cyan-accent transition-all">
            <option value="">Select parent group</option>
            <option>Direct CX</option>
            <option>Self Serve</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-text-muted mb-2">Billing Plans</label>
          <div class="space-y-2">
            <label v-for="plan in billingPlanOptions" :key="plan" class="flex items-center gap-2 text-sm text-console-text cursor-pointer">
              <input type="checkbox" :value="plan" v-model="form.plans" class="w-4 h-4 cursor-pointer" />
              {{ plan }}
            </label>
          </div>
        </div>
      </form>
      <template #footer>
        <button class="px-4 py-2 bg-gray-700 text-text-muted text-sm rounded hover:bg-gray-600 transition-all" @click="autofill">⚡ Auto-fill</button>
        <div class="flex gap-3">
          <button class="px-5 py-2 border border-console-border text-text-muted text-sm rounded hover:bg-gray-700 transition-all" @click="showModal = false">Cancel</button>
          <button class="px-5 py-2 bg-gradient-to-r from-cyan-accent to-green-accent text-console-dark font-bold text-sm uppercase tracking-wide rounded hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] transition-all" @click="createAccount">Create</button>
        </div>
      </template>
    </AppModal>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout  from '../components/AppLayout.vue'
import AppModal   from '../components/AppModal.vue'
import StatusBadge from '../components/StatusBadge.vue'

const router = useRouter()
const search = ref('')
const planFilter = ref('')
const showModal = ref(false)
const activeMenu = ref(null)

const columns = ['Account Name', 'Account ID', 'Account Admins', 'Parent Group', 'Billing Plans Access', 'Created On', 'Created By', '']
const billingPlanOptions = ['Self Hosted SDK', 'Sanas Cloud SDK']

const form = ref({ name: '', admin: '', parentGroup: '', plans: [] })

const accounts = ref([
  { name: 'Self Technologies Inc', id: 'MMNYBVQH', admins: [{init:'JM'},{init:'AP'}], parentGroup: 'Production > OnePlus',  plans: ['Self Hosted SDK','Sanas Cloud SDK'], date: '13 Mar 2026', creator: 'jerrand.paloma' },
  { name: 'Rohit-cx-test',         id: 'MMM3S6AD', admins: [{init:'RK'}],              parentGroup: 'Production > Real Me',   plans: ['Sanas Cloud SDK'],                  date: '11 Mar 2026', creator: 'Rohit.mosigan@san...' },
  { name: 'R1RCM',                 id: 'R1RCM001', admins: [{init:'SY'}],              parentGroup: 'Production',             plans: ['Self Hosted SDK','Sanas Cloud SDK'], date: '15 Mar 2026', creator: 'System' },
  { name: 'PJ Testing Account',    id: 'MMLUXIXU', admins: [{init:'PJ'}],              parentGroup: 'Staging',                plans: ['Self Hosted SDK'],                  date: '11 Mar 2026', creator: 'Pratyaksha Joshi' },
  { name: 'Pitch Perfect Solutions',id:'MMKZEXKO', admins: [{init:'JM'},{init:'AP'}],  parentGroup: 'Production > OnePlus',   plans: ['Self Hosted SDK','Sanas Cloud SDK'], date: '11 Mar 2026', creator: 'jerrand.paloma' },
  { name: 'Test Kushant',          id: 'MMKT9K36', admins: [{init:'KG'}],              parentGroup: 'UAT',                    plans: ['Sanas Cloud SDK'],                  date: '10 Mar 2026', creator: 'Kushant Gang' },
  { name: 'Jerrand Test AT',       id: 'MMKH3VYN', admins: [{init:'JM'}],              parentGroup: 'Staging',                plans: ['Self Hosted SDK'],                  date: '10 Mar 2026', creator: 'jerrand.paloma' },
  { name: 'Jerrand Test AT',       id: 'MMKRW3H3', admins: [{init:'JM'}],              parentGroup: 'Production > OnePay',    plans: ['Self Hosted SDK','Sanas Cloud SDK'], date: '10 Mar 2026', creator: 'jerrand.paloma' },
  { name: 'Production',            id: 'MMKRP8YY', admins: [{init:'ZU'}],              parentGroup: 'Production',             plans: ['Sanas Cloud SDK'],                  date: '10 Mar 2026', creator: 'Zupudi.uday@san...' },
  { name: 'Pratyaksha Test',       id: 'MMKDFRSM', admins: [{init:'PJ'},{init:'AP'}],  parentGroup: 'Production > Real Me',   plans: ['Self Hosted SDK'],                  date: '10 Mar 2026', creator: 'pratyaksha.joshi...' },
])

const filteredAccounts = computed(() =>
  accounts.value.filter(a =>
    (!search.value || a.name.toLowerCase().includes(search.value.toLowerCase()) || a.id.toLowerCase().includes(search.value.toLowerCase())) &&
    (!planFilter.value || a.plans.includes(planFilter.value))
  )
)

function goToAccount(acc) {
  router.push({ path: `/accounts/${acc.id}`, query: { name: acc.name, plans: JSON.stringify(acc.plans) } })
}

function autofill() {
  form.value = { name: 'Test Account ' + Math.floor(Math.random() * 1000), admin: 'test.admin@sanas.ai', parentGroup: 'Direct CX', plans: [...billingPlanOptions] }
}

function createAccount() {
  if (!form.value.name || !form.value.admin || !form.value.parentGroup || !form.value.plans.length) return
  const initials = form.value.admin.split('@')[0].substring(0, 2).toUpperCase()
  accounts.value.unshift({
    name: form.value.name,
    id: 'MM' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    admins: [{ init: initials }],
    parentGroup: form.value.parentGroup,
    plans: [...form.value.plans],
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    creator: form.value.admin,
  })
  form.value = { name: '', admin: '', parentGroup: '', plans: [] }
  showModal.value = false
}
</script>
```

- [ ] **Step 2: Navigate to `/accounts` in browser and verify layout, table data, search filter, modal, and row navigation all work**

- [ ] **Step 3: Commit**

```bash
git add src/views/AccountsView.vue
git commit -m "feat: add AccountsView with table, filters, and create modal"
```

---

## Task 9: MembersView

**Files:**
- Create: `src/views/MembersView.vue`

Reference: `html-originals/members.html`. Uses the **light theme** (white background). Shows "Sanas Members" heading, "Portal Users" sub-tab, search/filter toolbar, and a table of 10 members with status badges (Activated / Deactivated / Invitation Sent) and Manage Access links. Pagination controls at bottom (display only, not functional).

- [ ] **Step 1: Create src/views/MembersView.vue**

```vue
<template>
  <!-- Members uses light theme wrapper, not AppLayout -->
  <div class="min-h-screen bg-gray-50 text-gray-900 flex">
    <!-- Light sidebar -->
    <aside class="w-[260px] bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div class="flex items-center gap-3 p-4 border-b border-gray-200">
        <div class="flex flex-col gap-[3px] w-5 h-5 cursor-pointer">
          <span class="w-full h-[2px] bg-gray-400 block"></span>
          <span class="w-full h-[2px] bg-gray-400 block"></span>
          <span class="w-full h-[2px] bg-gray-400 block"></span>
        </div>
        <span class="font-semibold text-gray-800">sanas</span>
      </div>
      <div class="p-4">
        <input type="text" placeholder="Search Groups..." class="w-full px-3 py-2 border border-gray-200 rounded text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-indigo-400 mb-4" />
        <div v-for="item in sidebarItems" :key="item.label" :class="['flex items-center justify-between px-3 py-2.5 mb-1 rounded cursor-pointer text-sm', item.active ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50']">
          <div class="flex items-center gap-2"><span>{{ item.icon }}</span><span>{{ item.label }}</span></div>
          <span class="text-gray-400">›</span>
        </div>
      </div>
    </aside>

    <div class="flex flex-col flex-1 min-w-0">
      <!-- Light header -->
      <header class="bg-white border-b border-gray-200 px-8 flex justify-between items-center h-[60px] shadow-sm shrink-0">
        <nav class="flex gap-8 h-full">
          <RouterLink v-for="tab in headerTabs" :key="tab.to" :to="tab.to" :class="['flex items-center gap-1.5 text-sm font-medium border-b-2 transition-all px-1 no-underline', $route.path === tab.to ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-gray-700']">
            <span>{{ tab.icon }}</span><span>{{ tab.label }}</span>
          </RouterLink>
        </nav>
        <div class="flex items-center gap-4">
          <button v-for="icon in ['🔔','❓']" :key="icon" class="w-9 h-9 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all">{{ icon }}</button>
          <span class="text-xs text-gray-500">Zupudi uday@sa...</span>
        </div>
      </header>

      <main class="flex-1 p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Sanas Members</h1>
        <div class="flex mb-4 border-b border-gray-200">
          <div class="px-4 py-2 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 cursor-pointer">Portal Users</div>
        </div>

        <!-- Toolbar -->
        <div class="flex items-center justify-between mb-4">
          <input v-model="search" type="text" placeholder="Search Portal Users" class="w-[280px] px-3 py-2 border border-gray-200 rounded text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-indigo-400" />
          <div class="flex gap-2">
            <select v-model="roleFilter" class="px-3 py-2 border border-gray-200 rounded text-sm text-gray-700 cursor-pointer focus:outline-none appearance-none bg-white pr-8">
              <option value="">All Roles</option>
              <option>Sanas Admin</option>
              <option>Sanas User</option>
            </select>
            <select v-model="statusFilter" class="px-3 py-2 border border-gray-200 rounded text-sm text-gray-700 cursor-pointer focus:outline-none appearance-none bg-white pr-8">
              <option value="">All Status</option>
              <option>Activated</option>
              <option>Deactivated</option>
              <option>Invitation Sent</option>
            </select>
            <button class="px-4 py-2 bg-emerald-600 text-white text-sm rounded flex items-center gap-2 hover:bg-emerald-700 transition-all">
              <span>Invite & Manage</span><span>✓</span>
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table class="w-full border-collapse">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">Name</th>
                <th class="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">Email Id</th>
                <th class="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">Status ⓘ</th>
                <th class="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200 cursor-pointer">Created On ↕</th>
                <th class="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">Created By</th>
                <th class="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">Manage Access</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in filteredMembers" :key="m.email" class="hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                <td class="px-4 py-3.5 text-sm text-gray-900">{{ m.name }}</td>
                <td class="px-4 py-3.5 text-sm text-gray-500">{{ m.email }}</td>
                <td class="px-4 py-3.5 text-sm">
                  <span :class="['inline-block px-2.5 py-1 rounded text-xs font-medium', statusClass(m.status)]">
                    {{ statusLabel(m.status) }}
                  </span>
                </td>
                <td class="px-4 py-3.5 text-sm text-gray-500">{{ m.date }}</td>
                <td class="px-4 py-3.5 text-sm text-gray-500">{{ m.creator }}</td>
                <td class="px-4 py-3.5 text-sm">
                  <a v-if="m.access" href="#" class="text-indigo-500 hover:underline text-sm">{{ m.access }}</a>
                  <span v-else class="text-gray-300">—</span>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Pagination -->
          <div class="flex items-center justify-end gap-4 px-4 py-3 border-t border-gray-200">
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <span>Rows per page:</span>
              <select class="px-2 py-1 border border-gray-200 rounded text-sm appearance-none bg-white cursor-pointer">
                <option>10</option><option>25</option><option>50</option>
              </select>
            </div>
            <span class="text-sm text-gray-500">1-10 of 84</span>
            <div class="flex gap-1">
              <button disabled class="w-8 h-8 border border-gray-200 rounded flex items-center justify-center text-gray-400 opacity-50 cursor-not-allowed">‹</button>
              <button class="w-8 h-8 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer">›</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search       = ref('')
const roleFilter   = ref('')
const statusFilter = ref('')

const sidebarItems = [
  { icon: '📊', label: 'Sanas',     active: true },
  { icon: '📍', label: 'Direct CX', active: false },
  { icon: '🔧', label: 'Self Serve',active: false },
]

const headerTabs = [
  { to: '/home',     icon: '🏠', label: 'Home' },
  { to: '/accounts', icon: '📄', label: 'Accounts' },
  { to: '/members',  icon: '👥', label: 'Sanas Members' },
]

const members = ref([
  { name: 'jeniffer.solano@sanas.ai',          email: 'jeniffer.solano@sanas.ai',          status: 'activated',       date: '10 Mar 2026', creator: 'Carlos Mejia',           access: 'Sanas Admin' },
  { name: 'Mallikarjuna.c@sanas.ai',           email: 'mallikarjuna.c@sanas.ai',           status: 'activated',       date: '10 Mar 2026', creator: 'Kushant Gang',           access: 'Sanas Admin' },
  { name: 'pratyaksha.joshi+01@sanas.ai',      email: 'pratyaksha.joshi+01@sanas.ai',      status: 'deactivated',     date: '10 Mar 2026', creator: 'Kushant Gang',           access: '' },
  { name: 'arvin@sanas.ai',                    email: 'arvin@sanas.ai',                    status: 'activated',       date: '9 Mar 2026',  creator: 'zupudi.uday@sanas.ai',   access: 'Sanas Admin' },
  { name: 'harshith.kumar1@sanas.ai',          email: 'harshith.kumar1@sanas.ai',          status: 'activated',       date: '9 Mar 2026',  creator: 'Harshith Gowda',         access: 'Sanas User' },
  { name: 'ronak.giri@sanas.ai',               email: 'ronak.giri@sanas.ai',               status: 'activated',       date: '24 Feb 2026', creator: 'zupudi.uday@sanas.ai',   access: 'Sanas Admin' },
  { name: 'john.hong@sanas.ai',                email: 'john.hong@sanas.ai',                status: 'activated',       date: '24 Feb 2026', creator: 'peter.venugoyen.01@sanas.ai', access: 'Sanas Admin' },
  { name: 'katherine.butalapei@sanas.ai',      email: 'katherine.butalapei@sanas.ai',      status: 'invitation-sent', date: '20 Feb 2026', creator: 'Harshith Gowda',         access: 'Sanas Admin' },
  { name: 'inderpreet.singh@sanas.ai',         email: 'inderpreet.singh@sanas.ai',         status: 'activated',       date: '20 Feb 2026', creator: 'Harshith Gowda',         access: 'Sanas Admin' },
  { name: 'vikash.kumar@sanas.ai',             email: 'vikash.kumar@sanas.ai',             status: 'activated',       date: '20 Feb 2026', creator: 'Harshith Gowda',         access: 'Sanas Admin' },
])

const filteredMembers = computed(() =>
  members.value.filter(m =>
    (!search.value || m.name.toLowerCase().includes(search.value.toLowerCase()) || m.email.toLowerCase().includes(search.value.toLowerCase())) &&
    (!roleFilter.value || m.access === roleFilter.value) &&
    (!statusFilter.value || statusLabel(m.status) === statusFilter.value)
  )
)

function statusLabel(s) {
  return s === 'activated' ? 'Activated' : s === 'deactivated' ? 'Deactivated' : 'Invitation Sent'
}
function statusClass(s) {
  return s === 'activated' ? 'bg-blue-100 text-blue-700' : s === 'deactivated' ? 'bg-gray-100 text-gray-500' : 'bg-indigo-100 text-indigo-700'
}
</script>
```

- [ ] **Step 2: Navigate to `/members` and verify light theme, table, filters, and pagination display**

- [ ] **Step 3: Commit**

```bash
git add src/views/MembersView.vue
git commit -m "feat: add MembersView with light theme and portal users table"
```

---

## Task 10: ApiKeysView

**Files:**
- Create: `src/views/ApiKeysView.vue`

Reference: `html-originals/api-keys.html` for exact HTML structure.

Dark theme. Left sidebar shows expandable group hierarchy (Production > 3 subgroups, Staging, UAT) using the same expand/collapse pattern from the original. Top: pill-shaped tab nav (Groups / API Keys), back button, breadcrumb. Content: search + filter toolbar, table of API keys (Name, Key masked, Group, Created At, Created By, Expires At, Status badge, Delete button), plus Create API Key modal (key name, validity options: Never / Duration / Date, generates random key, copy + checkbox to confirm).

- [ ] **Step 1: Create src/views/ApiKeysView.vue**

Read `html-originals/api-keys.html` thoroughly for the exact group hierarchy data, tab HTML, table columns, modal form, and all JS behavior, then implement as a Vue component following the same patterns as AccountsView. Key points:
- Sidebar replaces the shared AppSidebar with its own expandable tree (light bg items, chevrons, indent)
- The pill tab nav sits in a gray `top-nav` bar above the breadcrumb header
- Table rows have a delete button (trash icon or text)
- The create modal has: key name input, "Validity" section with three radio options (Never Expires / Duration / Date), a "Generate API Key" button that fills in a random `sk_live_...` key, a copy button, and a "I have saved this key" checkbox that enables the Save button

- [ ] **Step 2: Verify in browser: sidebar expands, tabs switch, table shows keys, modal opens and create flow works**

- [ ] **Step 3: Commit**

```bash
git add src/views/ApiKeysView.vue
git commit -m "feat: add ApiKeysView with expandable sidebar, tabs, key table, and create modal"
```

---

## Task 11: UsersView

**Files:**
- Create: `src/views/UsersView.vue`

Reference: `html-originals/users.html`.

Dark theme. Same expandable sidebar as ApiKeysView. Content: "Console Users" heading, search + role filter + status filter + "Invite Users" button. Table: Name, Email, Role & Access Scope (role/scope badge pairs, first 2 shown then "+N more" expand button), Status badge, Created On, Actions (Edit button + conditional Resend/Deactivate). Invite modal: email input + role select + group scope select + Add Row button. Edit modal: role-scope rows (add/remove). Deactivate confirmation modal.

- [ ] **Step 1: Create src/views/UsersView.vue**

Read `html-originals/users.html` thoroughly, then implement. Key data: 6 users each with `roleScopes` array of `{role, scope}` pairs. The `renderRoleScopeCombinations` pattern shows first 2 pairs as badges, rest hidden until "+N more" clicked.

- [ ] **Step 2: Verify in browser: table renders, role-scope expand works, invite and edit modals open**

- [ ] **Step 3: Commit**

```bash
git add src/views/UsersView.vue
git commit -m "feat: add UsersView with role-scope table and invite/edit modals"
```

---

## Task 12: UsageView

**Files:**
- Create: `src/views/UsageView.vue`

Reference: `html-originals/usage.html`.

Dark theme. Same expandable sidebar. Content: "Usage Dashboard" heading + Export CSV button. Feature tabs (All Products / Accent Translation / Noise Cancellation). Filters: multiselect dropdowns (API Key, Features), date range selector (Last 7/30/90 days + Custom), deployment type, time bucketing. Two Chart.js charts per tab (API Requests + Audio Minutes). Export CSV generates and downloads a file.

- [ ] **Step 1: Create src/views/UsageView.vue**

Read `html-originals/usage.html` for chart config and filter options. Use Chart.js with `onMounted` to initialize charts. Store chart refs with `ref()`. Re-initialize on tab switch by destroying and recreating. Key: charts use `canvas` elements, Chart.js line charts with gradient fills.

- [ ] **Step 2: Install check: confirm chart.js is installed**

```bash
npm list chart.js
```

- [ ] **Step 3: Verify in browser: charts render, tabs switch charts, date filter shows/hides custom inputs, Export CSV downloads a file**

- [ ] **Step 4: Commit**

```bash
git add src/views/UsageView.vue
git commit -m "feat: add UsageView with Chart.js analytics and filters"
```

---

## Task 13: AccountDetailView

**Files:**
- Create: `src/views/AccountDetailView.vue`

Reference: `html-originals/account-detail.html`.

Dark theme. Same expandable sidebar. Reads `name`, `id`, `plans` from `$route.query`. Content:
- Back button → `/accounts`
- Account name heading, subtitle "Manage your SDK keys and developer resources"
- **SDK Keys section** (only if `plans` includes "Self Hosted SDK"): shows existing keys (masked), Create New Key collapsible form (key name + expiry date), Show/Hide key toggle, Copy key button
- **Get Started section**: two code blocks (pip install + Python SDK init example) with Copy buttons
- **Sanas Playground section**: "Coming Soon" badge, description, preview card

- [ ] **Step 1: Create src/views/AccountDetailView.vue**

Read `html-originals/account-detail.html` for exact code block content and interaction. Key Vue patterns: `useRoute()` to read query params, `ref()` for key visibility state and show-new-key-form toggle, clipboard API for copy buttons.

- [ ] **Step 2: Navigate from accounts table row to verify detail page loads with correct name and plans**

- [ ] **Step 3: Commit**

```bash
git add src/views/AccountDetailView.vue
git commit -m "feat: add AccountDetailView with SDK keys and code blocks"
```

---

## Task 14: Update README and REQUIREMENTS

**Files:**
- Modify: `README.md`
- Modify: `REQUIREMENTS.md`

- [ ] **Step 1: Update README.md**

Add a new iteration entry documenting: migration from 7 standalone HTML files to Vue 3 + Vite + Tailwind CSS SPA, what components were created, how to run the project (`npm run dev`), and current state.

- [ ] **Step 2: Update REQUIREMENTS.md**

Add a new requirement entry for this migration with User Journey, User Story, Acceptance Criteria, and Open Questions (members page theme unification).

- [ ] **Step 3: Commit**

```bash
git add README.md REQUIREMENTS.md
git commit -m "docs: update README and REQUIREMENTS for Vue.js migration"
```

---

## Task 15: Final verification

- [ ] **Step 1: Run production build to check for errors**

```bash
npm run build
```
Expected: build completes without errors. Output in `dist/`.

- [ ] **Step 2: Run dev server and manually test all navigation paths**

```bash
npm run dev
```
Test checklist:
- [ ] Login page renders, button activates on valid email, navigates to `/accounts`
- [ ] Accounts table shows all 10 rows, search filters work, create modal adds a new row, row click navigates to detail
- [ ] Account detail shows correct name from URL, SDK keys section visible, code copy works
- [ ] Members page uses light theme, table shows 10 members with correct status badges
- [ ] API keys page loads (sidebar expands, tabs switch, table visible)
- [ ] Users page loads (role-scope table visible)
- [ ] Usage page loads with charts visible
- [ ] Header tabs (Accounts / Sanas Members) navigate correctly

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete Vue.js + Tailwind CSS migration of developer console"
```
