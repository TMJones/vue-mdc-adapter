import '@material/form-field/dist/mdc.form-field.css'
import '@material/switch/dist/mdc.switch.css'

import VueMDCSwitch from './mdc-switch.vue'

export {VueMDCSwitch}

export default {
  install (vm) {
    vm.component('mdc-switch', VueMDCSwitch)
  }
}
