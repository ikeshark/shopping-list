<template lang="html">
  <fragment>
    <button @click="isDetail = !isDetail">{{ item.name }}</button>
    <div v-if="isDetail || !isCompact">
      <span>{{ item.category }}</span>
      <span>{{ item.notes }}</span>
      <span>{{ item.quantity }}</span>
    </div>
  </fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'

export default {
  name: 'Item',
  components: { Fragment },
  props: ['isCompact'],
  data: function() {
    return {
      isDetail: false
    }
  }
}
</script>

<style lang="css" scoped>
</style>
