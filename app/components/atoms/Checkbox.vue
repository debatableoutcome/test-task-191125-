<template>
  <input
    class="checkbox"
    type="checkbox"
    :checked="modelValue"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
defineOptions({ name: 'Checkbox' })

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>
