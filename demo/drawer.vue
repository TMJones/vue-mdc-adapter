<template>
  <mdc-drawer ref="drawer" toggle-on="toggle-drawer">
    <mdc-drawer-header temporary></mdc-drawer-header>
    <mdc-drawer-list dense>
      <mdc-drawer-item v-for="link in links" :key="link.id"
        @click="$router.push(link.to)"
      >{{link.name}}</mdc-drawer-item>
    </mdc-drawer-list>
  </mdc-drawer>
</template>

<script>
import links from './links.js'

export default { 
  data () {
    return {
      links
    }
  }
}  
</script>
