import '@fortawesome/fontawesome-svg-core/styles.css'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowRotateLeft,
  faArrowRotateRight,
  faPlus,
  faPenToSquare,
  faTrash,
  faFloppyDisk,
  faXmark
} from '@fortawesome/free-solid-svg-icons'

export default defineNuxtPlugin(nuxtApp => {
  config.autoAddCss = false
  library.add(
    faArrowRotateLeft,
    faArrowRotateRight,
    faPlus,
    faPenToSquare,
    faTrash,
    faFloppyDisk,
    faXmark
  )
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
