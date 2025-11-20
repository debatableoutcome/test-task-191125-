<template>
  <section
    v-if="ready"
    class="todo-editor"
  >
    <div class="todo-editor__top-controls">
      <div class="todo-editor__history">
        <AtomsButton
          variant="secondary"
          :disabled="!canUndo"
          @click="undo"
        >
          <span class="todo-editor__icon-symbol">
            <FontAwesomeIcon
              :icon="['fas', 'arrow-rotate-left']"
              class="button__icon"
            />
          </span>
          <span class="todo-editor__icon-label">Отменить</span>
        </AtomsButton>
        <AtomsButton
          variant="secondary"
          :disabled="!canRedo"
          @click="redo"
        >
          <span class="todo-editor__icon-symbol">
            <FontAwesomeIcon
              :icon="['fas', 'arrow-rotate-right']"
              class="button__icon"
            />
          </span>
          <span class="todo-editor__icon-label">Вернуть</span>
        </AtomsButton>
      </div>
    </div>

    <div class="todo-editor__field">
      <label
        class="todo-editor__label"
        for="note-title"
      >
        Название заметки
      </label>
      <AtomsInput
        id="note-title"
        class="todo-editor__input"
        v-model="titleModel"
        placeholder="Введите заголовок"
      />
    </div>

    <div class="todo-editor__field">
      <label class="todo-editor__label">
        Задачи
      </label>
      <div class="todo-list">
        <MoleculesTodoItem
          v-for="todo in draft.todos"
          :key="todo.id"
          :todo="todo"
          :autofocus="todo.id === focusTodoId"
          @toggle="toggleTodo(todo.id)"
          @updateText="updateTodoText(todo.id, $event)"
          @remove="removeTodo(todo.id)"
        />
        <AtomsButton
          variant="secondary"
          @click="addTodoAndFocus"
        >
          <FontAwesomeIcon
            :icon="['fas', 'plus']"
            class="button__icon"
          />
          <span class="button__text">Добавить задачу</span>
        </AtomsButton>
        <div
          v-if="hasEmptyTodos"
          class="todo-editor__hint"
        >
          Заполните текст у всех задач, чтобы сохранить заметку.
        </div>
      </div>
    </div>

    <div class="todo-editor__toolbar">
      <div class="todo-editor__toolbar-group">
        <AtomsButton
          :disabled="saveDisabled"
          @click="handleSave"
        >
          <FontAwesomeIcon
            :icon="['fas', 'floppy-disk']"
            class="button__icon"
          />
          <span class="button__text">Сохранить</span>
        </AtomsButton>
        <AtomsButton
          variant="secondary"
          :disabled="!isDirty"
          @click="handleCancelClick"
        >
          <FontAwesomeIcon
            :icon="['fas', 'xmark']"
            class="button__icon"
          />
          <span class="button__text">Отменить редактирование</span>
        </AtomsButton>
        <AtomsButton
          v-if="!isNew"
          variant="danger"
          @click="handleDeleteClick"
        >
          <FontAwesomeIcon
            :icon="['fas', 'trash']"
            class="button__icon"
          />
          <span class="button__text">Удалить</span>
        </AtomsButton>
      </div>
    </div>

    <MoleculesModal
      v-model="cancelModalOpen"
      title="Отменить редактирование?"
      message="Отменить редактирование? Все несохранённые изменения будут потеряны."
      confirm-label="Выйти без сохранения"
      cancel-label="Продолжить редактирование"
      @confirm="cancelEditing"
    />

    <MoleculesModal
      v-if="!isNew"
      v-model="deleteModalOpen"
      title="Удалить заметку?"
      message="Удалить заметку? Это действие нельзя отменить."
      confirm-label="Удалить"
      cancel-label="Отмена"
      @confirm="deleteNote"
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
notesStore.initFromStorage()

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
const focusTodoId = ref<string | null>(null)

const setupInitial = () => {
  ready.value = false
  if (isNew.value) {
    createNewDraft()
    return
  }
  if (!props.noteId) {
    router.push('/notes')
    return
  }
  const existing = notesStore.getById(props.noteId)
  if (!existing) {
    router.push('/notes')
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
  router.push('/notes')
}

const handleCancelClick = () => {
  if (!isDirty.value) {
    router.push('/notes')
    return
  }
  cancelModalOpen.value = true
}

const cancelEditing = () => {
  resetToInitial()
  router.push('/notes')
}

const handleDeleteClick = () => {
  deleteModalOpen.value = true
}

const deleteNote = () => {
  if (!isNew.value) {
    notesStore.deleteNote(draft.value.id)
  }
  router.push('/notes')
}

const addTodoAndFocus = () => {
  addTodo()
  const last = draft.value.todos[draft.value.todos.length - 1]
  focusTodoId.value = last ? last.id : null
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
