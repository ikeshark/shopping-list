<template>
  <fragment>
  <div class="wrapper p-4 pb-12 rounded-t-lg relative">
    <div v-if="!isEdit">
      <h1 class="text-4xl text-center">Grocery List</h1>
      <ul class="border-blue-600 border-2 p-2">
        <li
          v-for="item in groceryList"
          :key="item.id"
          class="flex flex-wrap border-blue-500 border p-2"
        >
          <div class="flex w-full justify-between items-center">
            <div class="flex-1">
              <span class="font-bold">{{ item.name }}</span>
              <input
                :data-id="item.id"
                :value="item.notes"
                @change="editItem"
                class="block w-full border border-blue-400 px-1 text-sm"
                type="text"
              >
            </div>
            <div class="flex ml-4">
              <button
                type="button"
                class="block p-2 rounded-full border-gray-700 border"
                @click="purchaseItem"
                :value="item.id"
              >
                🛒
              </button>
              <button
                class="block ml-1 rounded-full p-2 border-gray-700 border"
                :value="item.id"
                type="button"
                @click="removeItem"
              >
                &times;
              </button>
            </div>
          </div>

        </li>
      </ul>
      <AddBtn v-on:add="isEdit = true" />
    </div>
    <div class="h-full" v-if="isEdit === true">
      <div class="flex h-full">
        <form class="w-1/2 pr-2">
          <h2 class="font-bold text-xl text-center">Add an item</h2>
          <ul class="border-orange-700 border p-1 overflow-y-scroll h-full">
            <li v-for="item in itemsLeft" :key="item.id"
              class="border-orange-500 border p-1 bg-yellow-400 mb-1"
            >
              <button
                type="button"
                class="w-full text-left"
                :value="item.id"
                :data-category="item.category"
                @click="addToList">
                {{ item.name }}
              </button>
            </li>
          </ul>
        </form>
        <div class="w-1/2">
          <h2 class="font-bold text-xl text-center">Bulk Add</h2>
          <button value="30" type="button" @click="bulkAdd"
            class="text-xl p-1 mb-1 border border-gray-700 block mx-auto rounded-lg">
            All items quantity 30% or less
          </button>
          <button value="20" type="button" @click="bulkAdd"
            class="text-xl p-1 mb-1 border border-gray-700 block mx-auto rounded-lg">
            All items quantity 20% or less
          </button>
          <button value="10" type="button" @click="bulkAdd"
            class="text-xl p-1 mb-4 border border-gray-700 block mx-auto rounded-lg">
            All items quantity 10% or less
          </button>
          <h2 class="font-bold text-xl text-center">Quick Add</h2>
          <label>
            Item Name
            <input
              v-model="quickAddInput"
              class="block p-1 border border-gray-500 text-xl text-black shadow-lg mb-4 w-full"
              type="text" name="" value="">
          </label>
          <button
            type="button"
            @click="quickAdd"
            name="button"
            class="block text-xl w-full border border-green-200 bg-green-700 text-white px-1 mb-6 text-sm"

          >SUBMIT</button>
          <h2 class="font-bold text-xl text-center">Cancel</h2>
          <button
            type="button"
            @click="isEdit = false"
            name="button"
            class="block text-xl w-full border border-red-200 bg-red-700 text-white px-1 text-sm"

          >EXIT</button>
        </div>
      </div>
    </div>
  </div>
  <p>this is outside the wrapper Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  </fragment>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { Fragment } from 'vue-fragment'

import AddBtn from '../components/AddBtn.vue';

export default {
  name: "GroceryList",
  components: { AddBtn, Fragment },
  data: function() {
    return {
      isEdit: false,
      quickAddInput: ''
    }
  },
  computed: {
    ...mapGetters(['sortedByCategory']),
    ...mapState(['groceryList']),
    itemsLeft: function() {
      return this.sortedByCategory.filter(item => {
        const nameArray = this.groceryList.map(item => item.name);
        if (nameArray.indexOf(item.name) === -1) return true;
        else return false;
      })
    }
  },
  methods: {
    addToList: function({ target }) {
      const id = parseInt(target.value);
      const category = target.getAttribute('data-category');
      this.$store.commit('addGrocery', { name: target.innerText, id, category });
      this.isEdit = false;
    },
    removeItem: function({ target }) {
      let id = parseInt(target.value);
      id = Number.isNaN(id) ? target.value : id;
      this.$store.commit('removeGrocery', id)
    },
    editItem: function({ target }) {
      const id = parseInt(target.getAttribute('data-id'));
      this.$store.commit('editGrocery', { notes: target.value, id })
    },
    purchaseItem: function({ target }) {
      const id = parseInt(target.value);
      this.$store.commit('removeGrocery', id);
      this.$store.commit('purchasedItem', id);
      this.$store.commit('updateQuantity', { id, value: 100 });
    },
    bulkAdd: function({ target }) {
      const targetValue = parseInt(target.value)
      this.itemsLeft.forEach(item => {
        if (item.quantity <= targetValue) this.$store.commit('addGrocery', {
          name: item.name, id: item.id, category: item.category
        });
      });
      this.isEdit = false;
    },
    quickAdd: function() {
      const id = this.quickAddInput;
      const category = 'uncategorized';
      this.$store.commit('addGrocery', { name: this.quickAddInput, id, category });
    }
  }
};
</script>

<style lang="css" scoped>
  .wrapper {
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.5);
    margin: 0 auto 1rem auto;
    max-width: 666px;
    height: calc(100vh - 4rem);
  }
</style>
