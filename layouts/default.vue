<template>
  <div class="app">
    <header class="app__header">
      <button
        class="app__header-title"
        type="button"
        @click="goHome"
      >
        Заметки
      </button>
      <AtomsButton
        variant="secondary"
        @click="goToNew"
      >
        <FontAwesomeIcon
          :icon="['fas', 'plus']"
          class="button__icon"
        />
        <span class="button__text">Создать заметку</span>
      </AtomsButton>
    </header>
    <main class="app__main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const goHome = () => {
  router.push('/notes')
}

const goToNew = () => {
  router.push('/notes/new')
}
</script>
