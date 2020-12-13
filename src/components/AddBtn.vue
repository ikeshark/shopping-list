<template lang="html">
  <button class="absolute bottom-0 mb-2 w-8 h-8 rounded-full border-2 border-blue-900 bg-blue-200 text-4xl leading-none bold sm:static sm:w-auto sm:h-auto sm:mt-2 sm:mx-auto sm:block sm:px-4 sm:py-2 sm:text-xl" @click="$emit('add')">
    <span class="-mt-2 block sm:hidden">&plus;</span>
    <span class="hidden sm:block">Add new item</span>
  </button>
</template>

<script>
export default {
  name: 'AddBtn'
}
</script>
