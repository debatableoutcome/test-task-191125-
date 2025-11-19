<template>
  <div class="app">
    <header class="app__header">
      <div class="app__header-title">
        Notes
      </div>
      <div class="app__header-actions">
        <button
          type="button"
          class="button button--secondary"
          @click="goToNew"
        >
          New note
        </button>
      </div>
    </header>
    <main class="app__main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const goToNew = () => {
  router.push('/notes/new')
}
</script>
