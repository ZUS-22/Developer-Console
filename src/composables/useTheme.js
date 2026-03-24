import { ref, watch } from 'vue'

const STORAGE_KEY = 'sanas-theme'

const stored = localStorage.getItem(STORAGE_KEY)
const isDark = ref(stored ? stored === 'dark' : true)

function applyTheme(dark) {
  document.documentElement.classList.toggle('light', !dark)
}

applyTheme(isDark.value)

watch(isDark, (dark) => {
  applyTheme(dark)
  localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
})

export function useTheme() {
  function toggle() {
    isDark.value = !isDark.value
  }
  return { isDark, toggle }
}
