<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="modal"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="messageId"
    >
      <div
        class="modal__backdrop"
        @click="handleCancel"
      />
      <div
        ref="dialogRef"
        class="modal__dialog"
        tabindex="-1"
        @keydown="handleKeydown"
      >
        <div
          :id="titleId"
          class="modal__title"
        >
          {{ title }}
        </div>
        <div
          :id="messageId"
          class="modal__message"
        >
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
import { nextTick, useId } from 'vue'

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

const uid = useId()
const titleId = computed(() => `modal-title-${uid}`)
const messageId = computed(() => `modal-description-${uid}`)

const confirmLabelComputed = computed(() => props.confirmLabel || 'Подтвердить')
const cancelLabelComputed = computed(() => props.cancelLabel || 'Отмена')

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

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    handleCancel()
    return
  }
  if (event.key !== 'Tab') {
    return
  }

  const dialog = dialogRef.value
  if (!dialog) {
    return
  }

  const focusable = Array.from(
    dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(el => !el.hasAttribute('disabled'))

  if (!focusable.length) {
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement

  if (event.shiftKey && active === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(
  () => props.modelValue,
  value => {
    if (value) {
      if (typeof document !== 'undefined') {
        lastFocusedElement = document.activeElement
      }
      nextTick(() => {
        if (dialogRef.value) {
          dialogRef.value.focus()
        }
      })
    } else if (typeof document !== 'undefined' && lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus()
      lastFocusedElement = null
    }
  }
)
</script>
