# Design Spec: Migrate HTML Prototype to Vue.js

**Date:** 2026-03-24
**Status:** Approved

---

## Goal

Convert 7 standalone HTML files into a modular Vue.js single-page application. Replace all hand-written CSS with Tailwind CSS. Preserve all existing visual design and interactive behavior exactly.

---

## Tech Stack

- **Vite** — build tool and dev server
- **Vue 3** — component framework (Composition API)
- **Vue Router** — client-side navigation between pages
- **Tailwind CSS** — utility-first CSS replacing all hand-written styles
- **Chart.js** — retained for usage analytics (already used in usage.html)

---

## Pages → Routes

| HTML File | Vue View | Route |
|---|---|---|
| index.html | LoginView.vue | `/` |
| accounts.html | AccountsView.vue | `/accounts` |
| api-keys.html | ApiKeysView.vue | `/api-keys` |
| members.html | MembersView.vue | `/members` |
| users.html | UsersView.vue | `/users` |
| usage.html | UsageView.vue | `/usage` |
| account-detail.html | AccountDetailView.vue | `/accounts/:id` |

---

## Component Architecture

### Shared Components

| Component | Purpose |
|---|---|
| `AppLayout.vue` | Wraps all authenticated pages — renders sidebar + main content slot |
| `AppSidebar.vue` | Expandable account/group tree, logo, nav links — shared across all dashboard pages |
| `AppHeader.vue` | Breadcrumb navigation and top action bar |
| `DataTable.vue` | Reusable table with configurable columns, row hover effects, action slots |
| `StatusBadge.vue` | Color-coded inline badges for status (Active/Expired) and roles (Admin/Member) |
| `AppModal.vue` | Generic modal overlay with slot for form content |

### View Files

Each view is responsible for its own page-specific layout, data, and logic. Views compose shared components and pass data via props.

---

## CSS Strategy

- **Tailwind utility classes** replace all CSS properties throughout
- **Custom Tailwind config** defines the design system tokens:
  - `bg-console-dark: #0a0e17`
  - `bg-console-sidebar: #13182b`
  - `border-console: #1e2847`
  - `accent-cyan: #00d9ff`
  - `accent-green: #00ff88`
- **Global CSS file** (`src/assets/main.css`) contains only:
  - Tailwind directives (`@tailwind base/components/utilities`)
  - Grid background animation (`@keyframes gridScroll`) — not expressible in Tailwind
  - Logo pulse animation
- Members page retains its light theme via Tailwind's `bg-white` / `text-gray-*` classes

---

## Data

- All page data remains as static JavaScript arrays/objects within each view file
- No backend integration changes
- Data shape preserved exactly from original HTML

---

## Open Questions

1. **Members page theme** — currently uses a light/white design vs. dark futuristic theme everywhere else. Should it be unified? (Not blocking — kept as-is for now)

---

## Out of Scope

- No backend or API changes
- No new features beyond what exists in the HTML files
- No state management library (Pinia/Vuex) — static data doesn't require it
