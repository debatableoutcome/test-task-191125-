<template>
  <div class="todo-item">
    <AtomsCheckbox
      class="todo-item__checkbox"
      :model-value="todo.done"
      @update:model-value="toggle"
    />
    <AtomsInput
      class="todo-item__text-input"
      :class="{ 'todo-item__text-input--done': todo.done }"
      variant="bare"
      :model-value="todo.text"
      placeholder="Todo text"
      @update:model-value="updateText"
    />
    <div class="todo-item__actions">
      <AtomsButton
        variant="ghost"
        @click="remove"
      >
        ✕
      </AtomsButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '~/types/notes'

defineOptions({ name: 'TodoItem' })

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggle: []
  updateText: [value: string]
  remove: []
}>()

const toggle = () => {
  emit('toggle')
}

const updateText = (value: string) => {
  emit('updateText', value)
}

const remove = () => {
  emit('remove')
}
</script>
