<template>
  <div class='app'>
    <header class='app__header'>
      <div class='app__header-title'>
        Заметки
      </div>
      <AtomsButton
        variant='secondary'
        @click='goToNew'
      >
        Создать новую заметку
      </AtomsButton>
    </header>
    <main class='app__main'>
      <slot />
    </main>
  </div>
</template>

<script setup lang='ts'>
const router = useRouter()

const goToNew = () => {
  router.push('/notes/new')
}
</script>

