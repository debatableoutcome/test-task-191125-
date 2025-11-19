<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="classes"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineOptions({ name: 'Button' })

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const classes = computed(() => {
  const base = ['button']
  if (props.variant === 'secondary') {
    base.push('button--secondary')
  } else if (props.variant === 'danger') {
    base.push('button--danger')
  } else if (props.variant === 'ghost') {
    base.push('button--ghost')
  }
  return base
})

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    return
  }
  emit('click', event)
}
</script>
