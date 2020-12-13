<template>
  <div class="wrapper">
    <table class="border-separate w-full border-2 border-gray-600 bg-gray-200 mx-auto">
      <thead>
        <tr class="sticky top-0">
          <th class="sticky bg-gray-700 text-white top-0 border border-gray-500 px-4 py-2">
            <button type="button" value="name" @click="updateSortType">
              ↑
            </button>
            Name
            <button type="button" value="name" @click="updateSortType">
              &#8595;
            </button>
          </th>
          <th class="sticky bg-gray-700 text-white top-0 border border-gray-500 px-4 py-2">
            <button type="button" value="category" @click="updateSortType">
              ↑
            </button>
            Category
            <button type="button" value="category" @click="updateSortType">
              &#8595;
            </button>
          </th>
          <th class="sticky bg-gray-700 text-white top-0 border border-gray-500 px-4 py-2">
            <button type="button" value="quantity" @click="updateSortType">
              ↑
            </button>
            Quantity
            <button type="button" value="quantity" @click="updateSortType">
              &#8595;
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in sortedItems" :key="item.id">
          <td class="border border-gray-500 px-2 py-2">{{ item.name }}</td>
          <td class="border border-gray-500 px-2 py-2">{{ item.category }}</td>
          <td class="border border-gray-500 px-2 py-2">
            <label :for="item.id" class="sr-only">
              quantity
            </label>
            <input class="w-9/12" type="range" :id="item.id" @change="updateQuantity" :value="item.quantity">
            <span class="ml-4">{{ item.quantity }}%</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import { mapGetters } from 'vuex'
export default {
  name: "Home",
  data: function() {
    return {
      sortType: 'category',
      isAscending: true
    }
  },
  computed: {
    ...mapGetters(['sortedByCategory', 'sortedByName', 'sortedByQuantity' ]),
    sortedItems: function() {
      let returnArray;
      if (this.sortType === 'category') returnArray = this.sortedByCategory;
      else if (this.sortType === 'name') returnArray = this.sortedByName;
      else returnArray = this.sortedByQuantity;
      if (this.isAscending) return returnArray;
      else return returnArray.reverse();
    }
  },
  methods: {
    updateQuantity: function({ target }) {
      this.$store.commit('updateQuantity', {
        id: parseInt(target.id),
        value: parseInt(target.value)
      })
    },
    updateSortType: function({ target }) {
      if (target.innerText === '↑') this.isAscending = true;
      else this.isAscending = false;
      this.sortType = target.value;
    }
  }
};
</script>

<style lang="css" scoped>
  table {
    border-spacing: 0.5rem;
  }
  td {background-color: white; box-shadow: 1px 1px 0 #aaa}
  tbody tr:hover td {
    background-color: #edf2f7
  }
  .wrapper {
    padding: 0.125rem;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.5);
    margin: 0 auto 1rem auto;
    max-width: 666px;
    height: calc(100vh - 4rem);
    overflow-y: scroll;
  }
</style>
