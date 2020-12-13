<template lang="html">
  <div id="modal" @click="close" class="bg-opaque fixed top-0 left-0 z-10 flex items-center justify-center h-screen w-screen">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  methods: {
    close: function({ target }) {
      if (target.id === 'modal') this.$emit('closeModal')
    }
  }
}
</script>

<style lang="css" scoped>
  .bg-opaque {
    background-color: rgba(0,0,0,0.7);
  }
</style>
