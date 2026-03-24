import { createRouter, createWebHashHistory } from 'vue-router'

const LoginView           = () => import('../views/LoginView.vue')
const AccountsView        = () => import('../views/AccountsView.vue')
const AccountDetailView   = () => import('../views/AccountDetailView.vue')
const ApiKeysView         = () => import('../views/ApiKeysView.vue')
const MembersView         = () => import('../views/MembersView.vue')
const UsersView           = () => import('../views/UsersView.vue')
const UsageView           = () => import('../views/UsageView.vue')
const AccountApiKeysView  = () => import('../views/AccountApiKeysView.vue')
const AccountTeamView     = () => import('../views/AccountTeamView.vue')
const AccountUsageView    = () => import('../views/AccountUsageView.vue')

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',                         component: LoginView },
    { path: '/home',                     redirect: '/accounts' },
    { path: '/accounts',                 component: AccountsView },
    { path: '/accounts/:id',             component: AccountDetailView },
    { path: '/accounts/:id/api-keys',    component: AccountApiKeysView },
    { path: '/accounts/:id/team',        component: AccountTeamView },
    { path: '/accounts/:id/usage',       component: AccountUsageView },
    { path: '/api-keys',                 component: ApiKeysView },
    { path: '/members',                  component: MembersView },
    { path: '/users',                    component: UsersView },
    { path: '/usage',                    component: UsageView },
  ],
})

export default router
