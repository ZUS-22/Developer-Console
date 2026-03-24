<template>
  <div class="min-h-screen bg-black1 flex items-center justify-center p-6">
    <div class="bg-card border border-border1 rounded-r p-10 w-full max-w-[400px]">

      <!-- Logo -->
      <div class="mx-auto mb-6 flex items-center justify-center bg-grn rounded-rs w-9 h-9">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5">
          <circle cx="12" cy="12" r="4" stroke="black" stroke-width="2"/>
          <path d="M12 2 C7 6, 17 6, 12 10 C7 14, 17 14, 12 18 C7 22, 17 22, 12 22" stroke="black" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- Title -->
      <h1 class="font-display text-xl font-bold text-white text-center mb-1">Welcome back</h1>
      <p class="text-g3 text-sm text-center mb-8">Sign in to Sanas Developer Console</p>

      <!-- Email -->
      <div class="mb-4">
        <label class="block font-mono text-[11px] text-g3 mb-1.5">Email address</label>
        <input
          v-model="email"
          type="email"
          placeholder="admin.name@sanas.ai"
          class="w-full bg-card2 border border-border2 rounded-rxs text-white text-[12.5px] p-[8px_10px] focus:border-grn/40 outline-none transition-colors placeholder:text-g5"
          @keypress.enter="handleContinue"
        />
      </div>

      <!-- Continue Button -->
      <button
        @click="handleContinue"
        class="w-full py-2.5 rounded-rxs text-sm font-semibold transition-all mb-3"
        :class="isValidEmail
          ? 'bg-grn text-black hover:bg-grn2 cursor-pointer'
          : 'bg-card2 text-g5 cursor-not-allowed'"
      >
        Continue
      </button>

      <!-- Terms -->
      <p class="text-[11px] text-g5 text-center mb-6 leading-relaxed">
        By continuing you agree to our
        <a href="#" class="text-g3 hover:text-white transition-colors">Terms of Use</a>
      </p>

      <!-- Divider -->
      <div class="flex items-center gap-3 mb-5">
        <div class="flex-1 h-px bg-border1"></div>
        <span class="text-g5 text-[11px] font-mono">or</span>
        <div class="flex-1 h-px bg-border1"></div>
      </div>

      <!-- Google Sign In -->
      <button
        @click="handleGoogle"
        class="w-full flex items-center justify-center gap-2.5 bg-transparent text-g2 border border-border2 rounded-rxs py-2.5 text-sm font-medium hover:bg-card hover:text-white transition-all"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isValidEmail = computed(() => emailRegex.test(email.value))

function handleContinue() {
  if (isValidEmail.value) {
    router.push('/accounts')
  }
}

function handleGoogle() {
  router.push('/accounts')
}
</script>
