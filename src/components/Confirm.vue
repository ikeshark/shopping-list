<template lang="html">
  <Modal v-on:closeModal="$emit('dismiss')">
    <div class="w-10/12 max-666 bg-white p-4 border-double border-black border-8 shadow-red">
      <h2 class="text-2xl font-bold mb-4 text-center">Are you sure?</h2>
      <p class="mb-4 text-xl">{{ message }}</p>
      <button
        @click="$emit('confirm')" type="button"
        class="block w-full mb-4 p-4 border-double border-8 border-green-700 rounded-lg font-bold text-xl"
      >Yes, I’m sure</button>
      <button
        @click="$emit('dismiss')" type="button"
        class="block w-full mb-4 p-4 border-double border-8 border-red-700 rounded-lg font-bold text-xl"
      >
        ABORT
      </button>
    </div>
  </Modal>
</template>

<script>
import Modal from './Modal.vue';

export default {
  name: "Confirm",
  props: ['message'],
  components: {
    Modal
  }
}
</script>

<style lang="css" scoped>
.max-666 {
  max-width: 666px;
}
.shadow-red {
  box-shadow: 0 0 10px 3px red;
}
</style>
