import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Note } from '@/types/notes'

const STORAGE_KEY = 'notes-app-v1'

const cloneNote = (note: Note): Note =>
  JSON.parse(JSON.stringify(note)) as Note

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const initialized = ref(false)

  const getById = (id: string) =>
    notes.value.find((note: Note) => note.id === id) || null

  const initFromStorage = () => {
    if (initialized.value) {
      return
    }
    if (import.meta.client) {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          notes.value = JSON.parse(raw) as Note[]
        } catch {
          notes.value = []
        }
      }
    }
    initialized.value = true
  }

  const persist = () => {
    if (!import.meta.client) {
      return
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value))
  }

  const addNote = (note: Note) => {
    notes.value.push(cloneNote(note))
    persist()
  }

  const updateNote = (note: Note) => {
    const index = notes.value.findIndex((item: Note) => item.id === note.id)
    if (index !== -1) {
      notes.value[index] = cloneNote(note)
      persist()
    }
  }

  const deleteNote = (id: string) => {
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
