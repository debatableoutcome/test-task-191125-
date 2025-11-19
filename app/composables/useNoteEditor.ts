import { computed, ref } from 'vue'
import type { Note, Todo } from '@/types/notes'

const cloneNote = (note: Note): Note =>
  JSON.parse(JSON.stringify(note)) as Note

const generateId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

const createEmptyNote = (): Note => ({
  id: generateId(),
  title: '',
  todos: []
})

export const useNoteEditor = () => {
  const initialNote = ref<Note | null>(null)
  const draft = ref<Note>(createEmptyNote())
  const history = ref<Note[]>([])
  const future = ref<Note[]>([])
  const ready = ref(false)

  const setHistorySnapshot = () => {
    history.value.push(cloneNote(draft.value))
    if (history.value.length > 50) {
      history.value.shift()
    }
    future.value = []
  }

  const setNote = (note: Note) => {
    ready.value = false
    initialNote.value = cloneNote(note)
    draft.value = cloneNote(note)
    history.value = []
    future.value = []
    ready.value = true
  }

  const createNewDraft = () => {
    const note = createEmptyNote()
    setNote(note)
    return note
  }

  const updateTitle = (title: string) => {
    if (title === draft.value.title) {
      return
    }
    setHistorySnapshot()
    draft.value.title = title
  }

  const addTodo = () => {
    setHistorySnapshot()
    const todo: Todo = {
      id: generateId(),
      text: '',
      done: false
    }
    draft.value.todos.push(todo)
  }

  const removeTodo = (id: string) => {
    setHistorySnapshot()
    draft.value.todos = draft.value.todos.filter(todo => todo.id !== id)
  }

  const toggleTodo = (id: string) => {
    setHistorySnapshot()
    draft.value.todos = draft.value.todos.map(todo => {
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
    const currentTodo = draft.value.todos.find(todo => todo.id === id)
    if (!currentTodo || currentTodo.text === text) {
      return
    }
    setHistorySnapshot()
    draft.value.todos = draft.value.todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          text
        }
      }
      return todo
    })
  }

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

  const resetToInitial = () => {
    if (!initialNote.value) {
      return
    }
    draft.value = cloneNote(initialNote.value)
    history.value = []
    future.value = []
  }

  const syncInitialWithDraft = () => {
    initialNote.value = cloneNote(draft.value)
    history.value = []
    future.value = []
  }

  const canUndo = computed(() => history.value.length > 0)
  const canRedo = computed(() => future.value.length > 0)
  const isDirty = computed(() => {
    if (!initialNote.value) {
      return false
    }
    return JSON.stringify(draft.value) !== JSON.stringify(initialNote.value)
  })
  const saveDisabled = computed(() => draft.value.title.trim().length === 0)

  return {
    ready,
    draft,
    initialNote,
    canUndo,
    canRedo,
    isDirty,
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
  }
}
