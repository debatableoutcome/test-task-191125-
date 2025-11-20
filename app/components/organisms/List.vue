<template>
  <section class="notes">
    <h1 class="visually-hidden">
      Все заметки
    </h1>

    <div
      v-if="!notes.length"
      class="notes__empty"
    >
      Пока нет ни одной заметки. Нажмите «Создать заметку», чтобы добавить первую.
    </div>

    <div
      v-else
      class="notes__list"
    >
      <MoleculesCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @edit="openEdit"
        @delete="confirmDelete"
      />
    </div>

    <MoleculesModal
      v-if="noteIdToDelete"
      v-model="deleteModalOpen"
      title="Удалить заметку?"
      message="Удалить заметку? Это действие нельзя отменить."
      confirm-label="Удалить"
      cancel-label="Отмена"
      @confirm="performDelete"
      @cancel="handleDeleteCancel"
    />
  </section>
</template>

<script setup lang="ts">
import { useNotesStore } from '~/stores/notes'

defineOptions({ name: 'List' })

const notesStore = useNotesStore()
const router = useRouter()

notesStore.initFromStorage()

const notes = computed(() => notesStore.notes)

const deleteModalOpen = ref(false)
const noteIdToDelete = ref<string | null>(null)

const openEdit = (id: string) => {
  router.push(`/notes/${id}`)
}

const confirmDelete = (id: string) => {
  noteIdToDelete.value = id
  deleteModalOpen.value = true
}

const closeDeleteModal = () => {
  deleteModalOpen.value = false
  noteIdToDelete.value = null
}

const performDelete = () => {
  if (noteIdToDelete.value) {
    notesStore.deleteNote(noteIdToDelete.value)
  }
  closeDeleteModal()
}

const handleDeleteCancel = () => {
  closeDeleteModal()
}
</script>
