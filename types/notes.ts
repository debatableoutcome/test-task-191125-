export interface Todo {
  id: string
  text: string
  done: boolean
}

export interface Note {
  id: string
  title: string
  todos: Todo[]
}

export interface NotesState {
  notes: Note[]
  initialized: boolean
}