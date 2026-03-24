<template>
  <span :class="['inline-flex items-center gap-[3px] text-[10px] font-mono px-[7px] py-[2px] rounded-full font-medium border', colorClass]">
    {{ label }}
  </span>
</template>

<script setup>
const props = defineProps({ value: { type: String, required: true } })

const colorMap = {
  // status
  active:            'bg-grn/10 text-grn border-grn/[0.13]',
  activated:         'bg-grn/10 text-grn border-grn/[0.13]',
  expiring:          'bg-amb/10 text-amb border-amb/[0.13]',
  'invitation-sent': 'bg-blu/10 text-blu border-blu/[0.13]',
  invited:           'bg-blu/10 text-blu border-blu/[0.13]',
  expired:           'bg-red1/10 text-red1 border-red1/[0.13]',
  deactivated:       'bg-card2 text-g3 border-border1',
  // roles
  'account admin':   'bg-pur/10 text-pur border-pur/[0.13]',
  'group admin':     'bg-blu/10 text-blu border-blu/[0.13]',
  member:            'bg-card2 text-g3 border-border1',
  // billing
  'self hosted sdk': 'bg-blu/10 text-blu border-blu/[0.13]',
  'sanas cloud sdk': 'bg-grn/10 text-grn border-grn/[0.13]',
  // deployment
  cloud:             'bg-blu/10 text-blu border-blu/[0.13]',
  'self-hosted':     'bg-amb/10 text-amb border-amb/[0.13]',
}

const label = props.value.charAt(0).toUpperCase() + props.value.slice(1).replace(/-/g, ' ')
const colorClass = colorMap[props.value.toLowerCase()] ?? 'bg-card2 text-g3 border-border1'
</script>
