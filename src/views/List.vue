<template>
  <div class="wrapper p-4 pb-12 rounded-t-lg relative overflow-y-scroll">
    <div v-if="!sortedList.length">
      loading...
    </div>
    <div
      v-else
      v-for="store in sortedList"
      :key="store[0]"
      class="border-blue-600 border-2 p-2 mb-2"
    >
      <h2>{{store[0]}}</h2>
      <ul>
        <li
          v-for="(item, index) in store[1]"
          :key="item.name"
          class="flex flex-wrap border-blue-500 border p-2"
        >
          <div class="flex w-full justify-between items-center">
            <div class="flex-1">
              <span class="font-bold">{{ item.name }}</span>
              <input
                class="block w-full border border-blue-400 px-1 text-sm"
                :value="item.notes"
                :data-id="item.name"
                @change="editItem"
                type="text"
              >
            </div>
            <div class="flex ml-4">
              <button
                class="block ml-1 rounded-full p-2 border-gray-700 border"
                @click="removeItem"
                type="button"
                :value="index"
              >
                &times;
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="flex">
      <form @submit.prevent="addItem">
        <label>
          Item Name
          <input
            type="text"
            v-model="name"
            class="block border border-black p-1 mb-2"
          >
        </label>
        <label>
          Store
          <input
            type="text"
            v-model="store"
            class="block border border-black p-1 mb-2"
          >
        </label>
        <label>
          Notes
          <input
            type="text"
            v-model="notes"
            class="block border border-black p-1 mb-2"
          >
        </label>
        <button type="submit" name="button">Submit new item</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { householdsCollection } from '../firebase';

export default {
  name: "List",
  data: function() {
    return {
      data: [],
      name: '',
      store: '',
      notes: '',
    }
  },
  methods: {
    removeItem: function({ target }) {
      this.data.splice(target.value, 1);
      householdsCollection.doc(this.userProfile.household).update({
        groceryList: this.data
      });
    },
    addItem: function() {
      this.data.push({ name: this.name, notes: this.notes, store: this.store })
      householdsCollection.doc(this.userProfile.household).update({
        groceryList: this.data
      }).then(() => {
        this.name = '';
        this.notes = '';
        this.store = '';
      });
    },
    editItem: function({ target }) {
      const id = target.getAttribute('data-id');
      const index = this.data.findIndex(datum => datum.name === id);
      this.data[index].notes = target.value;
      householdsCollection.doc(this.userProfile.household).update({
        groceryList: this.data
      });
    }
  },
  computed: {
    ...mapState(["userProfile"]),
    sortedList: function() {
      if (this.data.length) {
        const results = {};
        this.data.forEach(datum => {
          if (results[datum.store]) {
            results[datum.store].push(datum)
          } else {
            results[datum.store] = [datum]
          }
        });
        return Object.entries(results);
      } else return []
    }
  },
  created: function() {
    if (this.userProfile.household) {
      householdsCollection.doc(this.userProfile.household).get()
      .then(doc => {
        if (doc.exists) {
          this.data = doc.data().groceryList;
        }
      })
      .catch(error => console.log(error))
    }
  }
}
</script>

<style lang="css" scoped>
  .wrapper {
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.5);
    margin: 0 auto 1rem auto;
    max-width: 666px;
    height: calc(100vh - 4rem);
  }
</style>
