<template>
  <section
    v-if='ready'
    class='todo-editor'
  >
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
          Отмена
        </AtomsButton>
        <AtomsButton
          v-if='!isNew'
          variant='danger'
          @click='handleDeleteClick'
        >
          Удалить
        </AtomsButton>
      </div>
      <div class='todo-editor__toolbar-group'>
        <AtomsButton
          variant='secondary'
          :disabled='!canUndo'
          @click='undo'
        >
          Отменить
        </AtomsButton>
        <AtomsButton
          variant='secondary'
          :disabled='!canRedo'
          @click='redo'
        >
          Повторить
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
import type { Note, Todo } from '@/types/notes'
import { useNotesStore } from '@/stores/notes'


defineOptions({ name: 'Editor' })

const props = defineProps<{
  noteId?: string
  isNew?: boolean
}>()

const router = useRouter()
const notesStore = useNotesStore()

notesStore.initFromStorage()

const isNew = computed(() => !!props.isNew)

const initialNote = ref<Note | null>(null)
const draft = ref<Note>({
  id: '',
  title: '',
  todos: []
})

const history = ref<Note[]>([])
const future = ref<Note[]>([])

const cancelModalOpen = ref(false)
const deleteModalOpen = ref(false)
const ready = ref(false)

const cloneNote = (note: Note): Note => {
  return JSON.parse(JSON.stringify(note)) as Note
}

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const setupInitial = () => {
  if (isNew.value) {
    const created: Note = {
      id: generateId(),
      title: '',
      todos: []
    }
    initialNote.value = cloneNote(created)
    draft.value = cloneNote(created)
    history.value = []
    future.value = []
    ready.value = true
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
  initialNote.value = cloneNote(existing)
  draft.value = cloneNote(existing)
  history.value = []
  future.value = []
  ready.value = true
}

setupInitial()

const pushHistory = () => {
  history.value.push(cloneNote(draft.value))
  if (history.value.length > 50) {
    history.value.shift()
  }
  future.value = []
}

const canUndo = computed(() => history.value.length > 0)
const canRedo = computed(() => future.value.length > 0)

const undo = () => {
  if (!history.value.length) {
    return
  }
  future.value.push(cloneNote(draft.value))
  const previous = history.value.pop()
  if (previous) {
    draft.value = previous
  }
}

const redo = () => {
  if (!future.value.length) {
    return
  }
  history.value.push(cloneNote(draft.value))
  const next = future.value.pop()
  if (next) {
    draft.value = next
  }
}

const titleModel = computed({
  get: () => draft.value.title,
  set: value => {
    if (value === draft.value.title) {
      return
    }
    pushHistory()
    draft.value.title = value
  }
})

const addTodo = () => {
  pushHistory()
  const todo: Todo = {
    id: generateId(),
    text: '',
    done: false
  }
  draft.value.todos.push(todo)
}

const removeTodo = (id: string) => {
  pushHistory()
  draft.value.todos = draft.value.todos.filter(
    (todo: Todo) => todo.id !== id
  )
}

const toggleTodo = (id: string) => {
  pushHistory()
  draft.value.todos = draft.value.todos.map((todo: Todo) => {
    if (todo.id === id) {
      return {
        ...todo,
        done: !todo.done
      }
    }
    return todo
  })
}

const updateTodoText = (id: string, text: string) => {
  const currentTodo = draft.value.todos.find(
    (todo: Todo) => todo.id === id
  )
  if (!currentTodo || currentTodo.text === text) {
    return
  }
  pushHistory()
  draft.value.todos = draft.value.todos.map((todo: Todo) => {
    if (todo.id === id) {
      return {
        ...todo,
        text
      }
    }
    return todo
  })
}


const isDirty = computed(() => {
  if (!initialNote.value) {
    return false
  }
  const left = JSON.stringify(draft.value)
  const right = JSON.stringify(initialNote.value)
  return left !== right
})

const saveDisabled = computed(() => {
  return draft.value.title.trim().length === 0
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
  initialNote.value = cloneNote(draft.value)
  history.value = []
  future.value = []
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
  if (initialNote.value) {
    draft.value = cloneNote(initialNote.value)
  }
  history.value = []
  future.value = []
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
  const isCtrlOrMeta = event.ctrlKey || event.metaKey
  if (!isCtrlOrMeta) {
    return
  }
  if (event.key === 'z' && !event.shiftKey) {
    event.preventDefault()
    undo()
    return
  }
  if (event.key === 'Z' || (event.key === 'z' && event.shiftKey)) {
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
