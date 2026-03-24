<template>
  <div>
    <!-- Row -->
    <div
      :style="{ paddingLeft: depth * 12 + 'px' }"
      :class="[
        'flex items-center gap-[7px] px-2 py-[5px] rounded-rxs cursor-pointer text-[12px] transition-all duration-[130ms] select-none',
        selectedId === node.id
          ? 'text-white bg-grn/10'
          : 'text-g4 hover:text-g2 hover:bg-card',
      ]"
      @click.stop="handleClick"
    >
      <!-- Chevron (only when has children) -->
      <svg
        v-if="node.children.length"
        :class="['w-3 h-3 shrink-0 transition-transform duration-150', open ? 'rotate-90' : '']"
        fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"
      >
        <polyline points="9 18 15 12 9 6"/>
      </svg>
      <!-- Spacer when leaf node -->
      <span v-else class="w-3 shrink-0" />

      <!-- Folder icon -->
      <svg class="w-3 h-3 shrink-0 opacity-60" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
      </svg>

      <span class="truncate">{{ node.name }}</span>
    </div>

    <!-- Children (recursive) -->
    <div v-if="open && node.children.length">
      <GroupTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :selected-id="selectedId"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  node:       { type: Object,  required: true },
  depth:      { type: Number,  default: 0 },
  selectedId: { type: String,  default: '' },
})
const emit = defineEmits(['select'])

const open = ref(true) // start expanded

function handleClick() {
  if (props.node.children.length) open.value = !open.value
  emit('select', props.node.id)
}
</script>
