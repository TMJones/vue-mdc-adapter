<template>
  <aside class="mdc-dialog" ref="root" :class="classes" :style="styles"
    role="alertdialog"
    :aria-labelledby="'label' + _uid"
    :aria-describedby="'desc' + _uid"
  >
    <div  ref="surface" class="mdc-dialog__surface" :class="surfaceClasses">
      <header class="mdc-dialog__header">
        <h2 :id="'label' + _uid" class="mdc-dialog__header__title">
          {{ title }}
        </h2>
      </header>
      <section :id="'desc' + _uid"
        class="mdc-dialog__body" :class="bodyClasses">
        <slot />
      </section>
      <footer class="mdc-dialog__footer">
        <mdcButton ref="cancel" v-if="cancel"
          class="mdc-dialog__footer__button mdc-dialog__footer__button--cancel">
          {{ cancel }}
        </mdcButton>
        <mdcButton  ref="accept"
        class="mdc-dialog__footer__button mdc-dialog__footer__button--accept">
          {{ accept }}
        </mdcButton>
      </footer>
    </div>
    <div class="mdc-dialog__backdrop"></div>
  </aside>
</template>

<script>
import MDCDialogFoundation from '@material/dialog/foundation'
import { createFocusTrapInstance } from '@material/dialog/util'
import {VueMDCButton} from '../button'

export default {
  name: 'mdc-dialog',
  props: {
    'title': { type: String, required: true },
    'accept': { type: String, default: 'Ok' },
    'cancel': { type: String, default: 'Cancel' },
    'scrollable': Boolean,
    'dark': Boolean
  },
  components: {
    mdcButton : VueMDCButton
  },
  data () {
    return {
      classes: {
        'mdc-theme--dark': this.dark
      },
      styles: {},
      surfaceClasses: {},
      bodyClasses: {
        'mdc-dialog__body--scrollable': this.scrollable
      }
    }
  },
  mounted () {
    this.focusTrap = createFocusTrapInstance(
      this.$refs.surface, this.$refs.accept)

    this.foundation = new MDCDialogFoundation({
      addClass: (className) => this.$set(this.classes, className, true),
      removeClass: (className) => this.$delete(this.classes, className),
      addBodyClass: (className) => document.body.classList.add(className),
      removeBodyClass: (className) => document.body.classList.remove(className),
      eventTargetHasClass: (target, className) =>
        target.classList.contains(className),
      registerInteractionHandler: (evt, handler) =>
        this.$refs.root.addEventListener(evt, handler),
      deregisterInteractionHandler: (evt, handler) =>
        this.$refs.root.removeEventListener(evt, handler),
      registerSurfaceInteractionHandler: (evt, handler) =>
        this.$refs.surface.addEventListener(evt, handler),
      deregisterSurfaceInteractionHandler: (evt, handler) =>
        this.$refs.surface.removeEventListener(evt, handler),
      registerDocumentKeydownHandler: (handler) =>
        document.addEventListener('keydown', handler),
      deregisterDocumentKeydownHandler: (handler) =>
        document.removeEventListener('keydown', handler),
      registerTransitionEndHandler: (handler) =>
        this.$refs.surface.addEventListener('transitionend', handler),
      deregisterTransitionEndHandler: (handler) =>
        this.$refs.surface.removeEventListener('transitionend', handler),
      notifyAccept: () => this.$emit('accept'),
      notifyCancel: () => this.$emit('cancel'),
      trapFocusOnSurface: () => this.focusTrap.activate(),
      untrapFocusOnSurface: () => this.focusTrap.deactivate(),
      isDialog: (el) => (this.$refs.surface === el),
      layoutFooterRipples: () => {
        this.$refs.accept.ripple.layout()
        this.cancel && this.$refs.cancel.ripple.layout()
      }
    })

    this.foundation.init()
  },
  beforeDestroy () {
    this.foundation.destroy()
  },
  methods: {
    show () {
      this.foundation.open()
    },
    close () {
      this.foundation.close()
    }
  }
}
</script>
