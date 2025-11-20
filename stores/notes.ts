import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Note } from '@/types/notes'

const STORAGE_KEY = 'notes-app-v1'

const SEED_NOTES: Note[] = [
  {
    id: 'seed-1',
    title: 'Список покупок',
    todos: [
      { id: 'seed-1-1', text: 'Купить молоко', done: false },
      { id: 'seed-1-2', text: 'Купить хлеб', done: true },
      { id: 'seed-1-3', text: 'Свежие фрукты', done: false }
    ]
  },
  {
    id: 'seed-2',
    title: 'Домашние дела',
    todos: [
      { id: 'seed-2-1', text: 'Поменять лампочку', done: true },
      { id: 'seed-2-2', text: 'Полить цветы', done: false }
    ]
  }
]

const cloneNote = (note: Note): Note =>
  JSON.parse(JSON.stringify(note)) as Note

const cloneNotes = (items: Note[]) => items.map(item => cloneNote(item))

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const initialized = ref(false)

  const persist = () => {
    if (!import.meta.client) {
      return
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value))
  }

  const hydrateFromSeed = () => {
    notes.value = cloneNotes(SEED_NOTES)
    persist()
  }

  const initFromStorage = () => {
    if (initialized.value || !import.meta.client) {
      return
    }
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        notes.value = JSON.parse(raw) as Note[]
      } catch {
        hydrateFromSeed()
      }
    } else {
      hydrateFromSeed()
    }
    initialized.value = true
  }

  const getById = (id: string) => {
    initFromStorage()
    return notes.value.find((note: Note) => note.id === id) || null
  }

  const addNote = (note: Note) => {
    initFromStorage()
    notes.value.push(cloneNote(note))
    persist()
  }

  const updateNote = (note: Note) => {
    initFromStorage()
    const index = notes.value.findIndex((item: Note) => item.id === note.id)
    if (index !== -1) {
      notes.value[index] = cloneNote(note)
      persist()
    }
  }

  const deleteNote = (id: string) => {
    initFromStorage()
    notes.value = notes.value.filter((item: Note) => item.id !== id)
    persist()
  }

  return {
    notes,
    initialized,
    getById,
    initFromStorage,
    persist,
    addNote,
    updateNote,
    deleteNote
  }
})
