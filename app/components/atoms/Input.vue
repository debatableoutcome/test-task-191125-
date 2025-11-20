<template>
  <input
    :id="id"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :autofocus="autofocus"
    :class="classes"
    @input="handleInput"
  />
</template>

<script setup lang="ts">
defineOptions({ name: 'Input' })

const props = withDefaults(
  defineProps<{
    modelValue: string
    id?: string
    type?: string
    placeholder?: string
    variant?: 'default' | 'bare'
    autofocus?: boolean
  }>(),
  {
    type: 'text',
    placeholder: '',
    variant: 'default',
    autofocus: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const classes = computed(() => {
  if (props.variant === 'bare') {
    return ['input', 'input--bare']
  }
  return ['input']
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
