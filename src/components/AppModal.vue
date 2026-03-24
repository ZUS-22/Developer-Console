<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      @click.self="$emit('update:modelValue', false)"
    >
      <div class="bg-card border border-border2 rounded-r w-[90%] max-w-lg shadow-2xl">
        <div class="flex items-center justify-between px-5 py-4 border-b border-border1">
          <h2 class="font-display font-semibold text-sm text-white">
            <slot name="title" />
          </h2>
          <button
            class="w-7 h-7 flex items-center justify-center rounded text-g4 hover:bg-card2 hover:text-white text-lg leading-none transition-all"
            @click="$emit('update:modelValue', false)"
          >&times;</button>
        </div>
        <div class="p-5">
          <slot />
        </div>
        <div v-if="$slots.footer" class="flex items-center justify-between px-5 py-4 border-t border-border1">
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
