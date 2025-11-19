<template>
  <article class='note-card'>
    <div class='note-card__header'>
      <div>
        <div class='note-card__title'>
          {{ note.title || 'Без названия' }}
        </div>
        <div class='note-card__meta'>
          {{ note.todos.length }} задач
        </div>
      </div>
    </div>
    <div
      v-if='note.todos.length'
      class='note-card__todos'
    >
      <div
        v-for='todo in previewTodos'
        :key='todo.id'
        class='note-card__todo'
      >
        <input
          class='note-card__todo-checkbox'
          type='checkbox'
          :checked='todo.done'
          disabled
        />
        <span class='note-card__todo-text'>
          {{ todo.text }}
        </span>
      </div>
      <div
        v-if='hiddenCount > 0'
        class='note-card__todo note-card__todo--more'
      >
        +{{ hiddenCount }} ещё
      </div>
    </div>
    <div class='note-card__actions'>
      <AtomsButton
        variant='secondary'
        @click='handleEdit'
      >
        Редактировать
      </AtomsButton>
      <AtomsButton
        variant='ghost'
        @click='handleDelete'
      >
        Удалить
      </AtomsButton>
    </div>
  </article>
</template>

<script setup lang='ts'>
import type { Note } from '@/types/notes'

defineOptions({ name: 'Card' })

const props = defineProps<{
  note: Note
}>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()

const previewTodos = computed(() => props.note.todos.slice(0, 3))

const hiddenCount = computed(() => {
  if (props.note.todos.length > 3) {
    return props.note.todos.length - 3
  }
  return 0
})

const handleEdit = () => {
  emit('edit', props.note.id)
}

const handleDelete = () => {
  emit('delete', props.note.id)
}
</script>
