<template>
  <OrganismsEditor :note-id="id" />
</template>

<script setup lang="ts">
const route = useRoute()
const id = computed(() => String(route.params.id))
</script>
