<template>
  <div>
    <!--fullwidth multiline case-->
    <div ref="root" :class="rootClasses" v-if="multiline && fullwidth">
      <textarea ref="input" :class="inputClasses"
        :value="value" @input="updateValue($event.target.value)"
        :rows="rows"
        :minlength="minlength" :maxlength="maxlength"
        :aria-controls="'help-'+_uid"
        :placeholder="label"
        :aria-label="label" >
        ></textarea>
    </div>

    <!--multiline case-->
    <div ref="root" :class="rootClasses" v-else-if="multiline">
      <textarea ref="input" :class="inputClasses" :id="_uid"
        :value="value" @input="updateValue($event.target.value)"
        :rows="rows" :cols="cols"
        :minlength="minlength" :maxlength="maxlength"
        :aria-controls="'help-'+_uid"
        ></textarea>
      <label ref="label" :class="labelClassesUpgraded" :for="_uid"  v-if="label">
        {{ label }}
      </label>
    </div>

    <!--fullwidth case: no label -->
    <div ref="root" :class="rootClasses" v-else-if="fullwidth">
      <input ref="input" :class="inputClasses" :type="type"
        :value="value" @input="updateValue($event.target.value)"
        :required="required"
        :minlength="minlength" :maxlength="maxlength"
        :aria-controls="'help-'+_uid"
        :placeholder="label"
        :aria-label="label" >
    </div>

    <!--default case -->
    <div ref="root" :class="rootClasses" v-else>
      <input ref="input" :class="inputClasses" :type="type" :id="_uid"
        :value="value" @input="updateValue($event.target.value)"
        :required="required" :size="size"
        :minlength="minlength" :maxlength="maxlength"
        :aria-controls="'help-'+_uid">
      <label ref="label" :class="labelClassesUpgraded" :for="_uid"  v-if="label">
        {{ label }}
      </label>
      <div ref="bottom" :class="bottomClasses"></div>
    </div>

    <!--help text -->
    <p ref="help" :id="'help-'+_uid" :class="helpClasses"
      aria-hidden="true" v-if="helptext">
      {{ helptext  }}
    </p>

  </div>
</template>

<script>
import MDCTextfieldFoundation from '@material/textfield/foundation'
import {RippleBase} from '../util'

export default {
  name: 'mdc-textfield',
  props: {
    'value': String,
    'type': {
      type: String,
      default: 'text',
      validator: function (value) {
        return ['text', 'email', 'search', 'password', 'tel', 'url']
          .includes(value)
      }
    },
    'dense': Boolean,
    'label': String,
    'helptext': String,
    'helptext-persistent': Boolean,
    'helptext-validation': Boolean,
    'disabled': Boolean,
    'required': Boolean,
    'minlength': { type: [Number, String], default: undefined },
    'maxlength': { type: [Number, String], default: undefined },
    'size': { type: [Number, String], default: 20 },
    'fullwidth': Boolean,
    'multiline': Boolean,
    'rows': { type: [Number, String], default: 8 },
    'cols': { type: [Number, String], default: 40 }
  },
  data: function () {
    return {
      text: this.value,
      rootClasses: {
        'mdc-text-field': true,
        'mdc-text-field--upgraded': true,
        'mdc-text-field--disabled': this.disabled,
        'mdc-text-field--dense': this.dense,
        'mdc-text-field--fullwidth': this.fullwidth,
        'mdc-text-field--textarea': this.multiline
      },
      inputClasses: {
        'mdc-text-field__input': true
      },
      labelClasses: {
        'mdc-text-field__label': true
      },
      bottomClasses: {
        'mdc-text-field__bottom-line': true
      },
      helpClasses: {
        'mdc-text-field-helptext': true,
        'mdc-text-field-helptext--persistent': this.helptextPersistent,
        'mdc-text-field-helptext--validation-msg': this.helptextValidation
      }
    }
  },
  watch:  {
    disabled () {
      this.foundation && this.foundation.setDisabled(this.disabled)
    }
  },
  methods: {
    updateValue (value) {
      this.$emit('input', value)
    }
  },
  computed: {
    labelClassesUpgraded () {
      return Object.assign(this.labelClasses, {
        'mdc-text-field__label--float-above': this.value
      })
    }
  },
  mounted () {
    this.foundation = new MDCTextfieldFoundation({
      addClass: (className) => {
        this.$set(this.rootClasses, className, true)
      },
      removeClass: (className) => {
        this.$delete(this.rootClasses, className)
      },
      addClassToLabel: (className) => {
        this.$set(this.labelClasses, className, true)
      },
      removeClassFromLabel: (className) => {
        this.$delete(this.labelClasses, className)
      },
      setIconAttr: (/* name: string, value: string */) => {},
      eventTargetHasClass: (target, className) =>  target.classList.contains(className),
      registerTextFieldInteractionHandler: (evtType, handler) => {
        this.$refs.root.addEventListener(evtType, handler)
      },
      deregisterTextFieldInteractionHandler: (evtType, handler) => {
        this.$refs.root.removeEventListener(evtType, handler)
      },
      addClassToBottomLine: (className) => {
        this.$set(this.bottomClasses, className, true)
      },
      removeClassFromBottomLine: (className) => {
        this.$delete(this.bottomClasses, className)
      },
      addClassToHelptext: (className) => {
        this.$set(this.helpClasses, className, true)
      },
      removeClassFromHelptext: (className) => {
        this.$delete(this.helpClasses, className)
      },
      helptextHasClass: (className) => {
        return this.$refs.help &&
          this.$refs.help.classList.contains(className)
      },
      registerInputInteractionHandler: (evtType, handler) => {
        this.$refs.input.addEventListener(evtType, handler)
      },
      deregisterInputInteractionHandler: (evtType, handler) => {
        this.$refs.input.removeEventListener(evtType, handler)
      },
      registerTransitionEndHandler: (handler) => {
        if (this.$refs.bottom) {
          this.$refs.bottom.addEventListener('transitionend', handler)
        }
      },
      deregisterTransitionEndHandler: (handler) => {
        if (this.$refs.bottom) {
          this.$refs.bottom.removeEventListener('transitionend', handler)
        }
      },
      setBottomLineAttr: (name, value) => {
        if (this.$refs.bottom) {
          this.$refs.bottom.setAttribute(name, value)
        }
      },
      setHelptextAttr: (name, value) => {
        if (this.$refs.help) {
          this.$refs.help.setAttribute(name, value)
        }
      },
      removeHelptextAttr: (name) => {
        if (this.$refs.help) {
          this.$refs.help.removeAttribute(name)
        }
      },
      getNativeInput: () => {
        return this.$refs.input
      },
      notifyIconAction: () => {
        this.$emit('icon')
      }
    })
    this.foundation.init()
    this.foundation.setDisabled(this.disabled)

    if (this.textbox) {
      this.ripple = new RippleBase(this)
      this.ripple.init()
    }


  },
  beforeDestroy () {
    this.foundation.destroy()
    if (this.ripple) {
      this.ripple.destroy()
    }
  }
}
</script>
