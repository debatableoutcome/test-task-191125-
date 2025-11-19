<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="modal"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
      @keydown.esc.prevent="handleEscape"
    >
      <div class="modal__backdrop" @click="handleCancel" />
      <div class="modal__dialog" ref="dialogRef" tabindex="-1">
        <div class="modal__title">
          {{ title }}
        </div>
        <div class="modal__message">
          {{ message }}
        </div>
        <div class="modal__buttons">
          <AtomsButton
            variant="secondary"
            @click="handleCancel"
          >
            {{ cancelLabelComputed }}
          </AtomsButton>
          <AtomsButton
            variant="danger"
            @click="handleConfirm"
          >
            {{ confirmLabelComputed }}
          </AtomsButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineOptions({ name: 'Modal' })


const props = defineProps<{
  modelValue: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const dialogRef = ref<HTMLElement | null>(null)
let lastFocusedElement: Element | null = null

const confirmLabelComputed = computed(
  () => props.confirmLabel || 'Подтвердить'
)
const cancelLabelComputed = computed(
  () => props.cancelLabel || 'Отмена'
)

watch(
  () => props.modelValue,
  value => {
    if (value) {
      lastFocusedElement = document.activeElement
      nextTick(() => {
        if (dialogRef.value) {
          dialogRef.value.focus()
        }
      })
    } else if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus()
      lastFocusedElement = null
    }
  }
)

const close = () => {
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  emit('confirm')
  close()
}

const handleCancel = () => {
  emit('cancel')
  close()
}

const handleEscape = () => {
  handleCancel()
}
</script>
