<template>
  <section
    v-if='ready'
    class='todo-editor'
  >
    <div class='todo-editor__top-controls'>
      <div class='todo-editor__history'>
        <AtomsButton
          variant='secondary'
          :disabled='!canUndo'
          title-attr='Отменить последнее действие'
          @click='undo'
        >
          <span class='todo-editor__icon-symbol'>↩</span>
          <span class='todo-editor__icon-label'>Шаг назад</span>
        </AtomsButton>
        <AtomsButton
          variant='secondary'
          :disabled='!canRedo'
          title-attr='Повторить отменённое действие'
          @click='redo'
        >
          <span class='todo-editor__icon-symbol'>↷</span>
          <span class='todo-editor__icon-label'>Шаг вперёд</span>
        </AtomsButton>
      </div>
    </div>

    <div class='todo-editor__field'>
      <label
        class='todo-editor__label'
        for='note-title'
      >
        Заголовок
      </label>
      <AtomsInput
        id='note-title'
        class='todo-editor__input'
        v-model='titleModel'
        placeholder='Название заметки'
      />
    </div>

    <div class='todo-editor__field'>
      <label class='todo-editor__label'>
        Список задач
      </label>
      <div class='todo-list'>
        <MoleculesTodoItem
          v-for='todo in draft.todos'
          :key='todo.id'
          :todo='todo'
          @toggle='toggleTodo(todo.id)'
          @updateText='updateTodoText(todo.id, $event)'
          @remove='removeTodo(todo.id)'
        />
        <AtomsButton
          variant='secondary'
          @click='addTodo'
        >
          Добавить задачу
        </AtomsButton>
        <div
          v-if='hasEmptyTodos'
          class='todo-editor__hint'
        >
          Заполните текст всех задач перед сохранением
        </div>
      </div>
    </div>

    <div class='todo-editor__toolbar'>
      <div class='todo-editor__toolbar-group'>
        <AtomsButton
          :disabled='saveDisabled'
          @click='handleSave'
        >
          Сохранить
        </AtomsButton>
        <AtomsButton
          variant='secondary'
          @click='handleCancelClick'
        >
          Отменить редактирование
        </AtomsButton>
        <AtomsButton
          v-if='!isNew'
          variant='danger'
          @click='handleDeleteClick'
        >
          Удалить
        </AtomsButton>
      </div>
    </div>

    <MoleculesModal
      v-model='cancelModalOpen'
      title='Отменить редактирование'
      message='Отменить несохранённые изменения?'
      confirm-label='Отменить изменения'
      cancel-label='Продолжить редактирование'
      @confirm='cancelEditing'
    />

    <MoleculesModal
      v-if='!isNew'
      v-model='deleteModalOpen'
      title='Удалить заметку'
      message='Удалить эту заметку? Действие нельзя будет отменить.'
      confirm-label='Удалить'
      cancel-label='Отмена'
      @confirm='deleteNote'
    />
  </section>
</template>


<script setup lang="ts">
import { useNotesStore } from '@/stores/notes'


defineOptions({ name: 'Editor' })

const props = defineProps<{
  noteId?: string
  isNew?: boolean
}>()

const router = useRouter()
const notesStore = useNotesStore()

const {
  ready,
  draft,
  canUndo,
  canRedo,
  isDirty,
  hasEmptyTodos,
  saveDisabled,
  createNewDraft,
  setNote,
  updateTitle,
  addTodo,
  removeTodo,
  toggleTodo,
  updateTodoText,
  undo,
  redo,
  resetToInitial,
  syncInitialWithDraft
} = useNoteEditor()

const isNew = computed(() => !!props.isNew)

const cancelModalOpen = ref(false)
const deleteModalOpen = ref(false)

const setupInitial = () => {
  ready.value = false
  if (isNew.value) {
    createNewDraft()
    return
  }
  if (!props.noteId) {
    router.push('/')
    return
  }
  const existing = notesStore.getById(props.noteId)
  if (!existing) {
    router.push('/')
    return
  }
  setNote(existing)
}

watch(
  () => [props.noteId, isNew.value],
  () => {
    setupInitial()
  },
  { immediate: true }
)

const titleModel = computed({
  get: () => draft.value.title,
  set: value => {
    updateTitle(value)
  }
})

const handleSave = () => {
  if (draft.value.title.trim().length === 0) {
    return
  }
  if (isNew.value) {
    notesStore.addNote(draft.value)
  } else {
    notesStore.updateNote(draft.value)
  }
  syncInitialWithDraft()
  router.push('/')
}

const handleCancelClick = () => {
  if (!isDirty.value) {
    router.push('/')
    return
  }
  cancelModalOpen.value = true
}

const cancelEditing = () => {
  resetToInitial()
  router.push('/')
}

const handleDeleteClick = () => {
  deleteModalOpen.value = true
}

const deleteNote = () => {
  if (!isNew.value) {
    notesStore.deleteNote(draft.value.id)
  }
  router.push('/')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!ready.value || cancelModalOpen.value || deleteModalOpen.value) {
    return
  }
  const isCtrlOrMeta = event.ctrlKey || event.metaKey
  if (!isCtrlOrMeta) {
    return
  }
  if (event.key === 'z' && !event.shiftKey) {
    if (!canUndo.value) {
      return
    }
    event.preventDefault()
    undo()
    return
  }
  if (event.key === 'Z' || (event.key === 'z' && event.shiftKey)) {
    if (!canRedo.value) {
      return
    }
    event.preventDefault()
    redo()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>
