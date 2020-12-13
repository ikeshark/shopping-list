<template>
  <div class="wrapper">
    <form @submit.prevent="submit">
      <label
        class="block p-4 border border-gray-600 text-xl text-black shadow-lg mb-4 text-left"
      >
        Item name
        <input
          class="block p-1 border border-gray-500 text-xl text-black shadow-lg mb-4 w-full"
          type="text"
          v-model="itemName"
        />
      </label>
      <label
        class="block p-4 border border-gray-600 text-xl text-black shadow-lg mb-4 text-left"
      >
        Item category
        <select
          class="block border border-gray-500 text-xl text-black shadow-lg mb-4 w-full"
          name="category"
          v-model="itemCategory"
        >
          <option v-for="item in categories" :key="item.id" :value="item.name">{{ item.name }}</option>
        </select>
      </label>
      <label>
        New category name
        <input
          class="block p-1 border border-gray-500 text-xl text-black shadow-lg mb-4 w-full"
          type="text" v-model="newCategory">
        <button type="button" @click="addCategory">Add new category</button>
      </label>
      <button
        class="block px-4 text-2xl text-black shadow-lg mb-4 mx-auto rounded-md border-double border-8 border-gray-700"
        name="button"
      >
        Submit
      </button>
    </form>
    <ul>
      <li
        v-for="item in sortedByCategory"
        :key="item.id"
        class="flex justify-between border-black border p-1 text-xl"
      >
        <span class="w-1/3">{{ item.name }}</span>
        <div class="relative w-1/3">
          <transition name="grow">
            <button
              class="absolute"
              :value="item.id"
              @click="editCategory"
              v-if="!isEditCategory || isEditCategoryId !== item.id"
            >
              {{ item.category }}
            </button>
          </transition>
          <transition name="grow">
            <select
              v-if="isEditCategory && isEditCategoryId === item.id"
              class="absolute"
              name="category"
              v-on:change="updateCategory"
            >
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.name"

              >{{ category.name }}</option>
            </select>
          </transition>
        </div>
        <button
          class="ml-auto mr-2"
          :id="item.id"
          @click="startDelete"
          type="button"
        >
          &times;
        </button>
      </li>
    </ul>
    <Confirm
      v-if="isConfirm"
      v-on:dismiss="isConfirm = false"
      v-on:confirm="deleteItem"
      message="Are you sure you want to delete this item from your pantry?"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Confirm from '../components/Confirm.vue';

export default {
  name: "List",
  data: function() {
    return {
      itemName: '',
      itemCategory: '',
      newCategory: '',
      isConfirm: false,
      isEditCategory: false,
      isEditCategoryId: false,
      itemToDelete: null
    };
  },
  computed: {
    ...mapGetters(['sortedByCategory']),
    ...mapState(['categories'])
  },
  methods: {
    submit: function() {
      this.nextId++;
      this.$store.commit('addItem', {
        name: this.itemName,
        category: this.itemCategory || "other",
      })
      this.itemName = '';
    },
    addCategory: function() {
      this.$store.commit('addCategory', this.newCategory);
      this.newCategory = '';
    },
    editCategory: function({ target }) {
      const id = parseInt(target.value);
      this.isEditCategory = true;
      this.isEditCategoryId = id;
    },
    updateCategory: function({ target }) {
      this.$store.commit('updateCategory', {
        id: this.isEditCategoryId,
        value: target.value
      })
      this.isEditCategory = false;
    },
    startDelete: function({ target }) {
      this.itemToDelete = parseInt(target.id);
      this.isConfirm = true;
    },
    deleteItem: function() {
      this.isConfirm = false;
      this.$store.commit('removeItem', this.itemToDelete);
    }
  },
  components: {
    Confirm
  }
};
</script>


<style lang="css" scoped>
  .wrapper {
    padding: 1rem;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.5);
    margin: 0 auto 1rem auto;
    max-width: 666px;
  }
  .grow-enter-active, .grow-leave-active {
    transition: transform .5s;
  }
  .grow-enter, .grow-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: scale(0)
  }
</style>
