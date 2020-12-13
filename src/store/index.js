import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../firebase";

Vue.use(Vuex);

const sampleData = [
  { name: "Bananas", category: "produce", id: 0, quantity: 70 },
  { name: "Peanut Butter", category: "nutslegumes", id: 1, quantity: 100 },
  { name: "Brown Rice", category: "grains", id: 2, quantity: 90 },
  { name: "Potato", category: "produce", id: 20, quantity: 0 },
  { name: "Oats", category: "grains", id: 3, quantity: 100 },
  { name: "Quinoa", category: "grains", id: 4, quantity: 100 },
  { name: "Celery", category: "produce", id: 5, quantity: 70 },
  { name: "Carrots", category: "produce", id: 6, quantity: 60 },
  { name: "Onion", category: "produce", id: 7, quantity: 0 },
  { name: "Garlic", category: "produce", id: 8, quantity: 40 },
  { name: "Ginger", category: "produce", id: 9, quantity: 50 },
  { name: "Frozen Fruit", category: "frozen", id: 10, quantity: 30 },
  { name: "Cashews", category: "nutslegumes", id: 11, quantity: 1 },
  { name: "Almonds", category: "nutslegumes", id: 12, quantity: 80 },
  { name: "Green Lentils", category: "nutslegumes", id: 13, quantity: 50 },
  { name: "Black Beans", category: "nutslegumes", id: 14, quantity: 10 },
  { name: "Flax", category: "other", id: 15, quantity: 50 },
  { name: "Coconut", category: "other", id: 16, quantity: 75 },
  { name: "Coffee", category: "beverages", id: 17, quantity: 50 },
  { name: "Chocolate", category: "baking", id: 18, quantity: 100 },
  { name: "Soy Sauce", category: "condiment", id: 19, quantity: 60 }
];

const categories = [
  { name: "baking", id: 0 },
  { name: "beverages", id: 1 },
  { name: "condiment", id: 2 },
  { name: "frozen", id: 3 },
  { name: "grains", id: 4 },
  { name: "nuts / legumes", id: 5 },
  { name: "other", id: 6 },
  { name: "produce", id: 7 },
  { name: "snacks", id: 8 }
];

export default new Vuex.Store({
  state: {
    user: {
      isAuth: false,
      data: null
    },
    userProfile: {},
    items: JSON.parse(localStorage.getItem("items")) || sampleData,
    groceryList: JSON.parse(localStorage.getItem("groceryList")) || [],
    history: JSON.parse(localStorage.getItem("history")) || [],
    categories: JSON.parse(localStorage.getItem("categories")) || categories
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    updateAuth(state, bool) {
      state.user.isAuth = bool;
    },
    updateUserData(state, data) {
      state.user.data = data;
    },
    addCategory(state, name) {
      state.categories.push({ name, id: state.categories.length });
      state.categories.sort((a, b) => {
        if (a.name > b.name) return 1;
        else return -1;
      });
      localStorage.categories = JSON.stringify(state.categories);
    },
    addItem(state, { name, category }) {
      state.items.push({
        name,
        category,
        id: state.items.length,
        quantity: 0
      });
      localStorage.items = JSON.stringify(state.items);
    },
    removeItem(state, id) {
      state.items = state.items.filter(item => item.id !== id);
      state.items = state.items.map((item, i) => {
        return { ...item, id: i };
      });
      localStorage.items = JSON.stringify(state.items);
    },
    updateQuantity(state, { id, value }) {
      const unaffected = state.items.filter(item => item.id !== id);
      let updatedItem = state.items.filter(item => item.id === id)[0];
      updatedItem.quantity = value;
      const updatedItems = [...unaffected, updatedItem];
      state.items = updatedItems;
      localStorage.items = JSON.stringify(state.items);
    },
    updateCategory(state, { id, value }) {
      const unaffected = state.items.filter(item => item.id !== id);
      let updatedItem = state.items.filter(item => item.id === id)[0];
      updatedItem.category = value;
      const updatedItems = [...unaffected, updatedItem];
      state.items = updatedItems;
      localStorage.items = JSON.stringify(state.items);
    },
    addGrocery(state, { name, id, notes, category }) {
      state.groceryList.push({ name, id, notes, category });
      state.groceryList.sort((a, b) => {
        if (a.name > b.name) return 1;
        else return -1;
      });
      state.groceryList.sort((a, b) => {
        if (a.category > b.category) return 1;
        else return -1;
      });
      localStorage.groceryList = JSON.stringify(state.groceryList);
    },
    editGrocery(state, { id, notes }) {
      const unaffected = state.groceryList.filter(item => item.id !== id);
      let updatedItem = state.groceryList.filter(item => item.id === id)[0];
      updatedItem.notes = notes;
      const updatedItems = [...unaffected, updatedItem];
      state.groceryList = updatedItems;
      state.groceryList.sort((a, b) => {
        if (a.name > b.name) return 1;
        else return -1;
      });
      state.groceryList.sort((a, b) => {
        if (a.category > b.category) return 1;
        else return -1;
      });
      localStorage.groceryList = JSON.stringify(state.groceryList);
    },
    removeGrocery(state, id) {
      state.groceryList = state.groceryList.filter(item => item.id !== id);
      localStorage.groceryList = JSON.stringify(state.groceryList);
    },
    purchasedItem(state, id) {
      state.history.push({
        date: new Date().getTime(),
        id
      });
      localStorage.history = JSON.stringify(state.history);
    }
  },
  getters: {
    sortedByCategory: state => {
      let sorted = state.items.sort((a, b) => {
        if (a.name > b.name) return 1;
        else return -1;
      });
      sorted = state.items.sort((a, b) => {
        if (a.category > b.category) return 1;
        else return -1;
      });

      return sorted;
    },
    sortedByName: state => {
      return state.items.sort((a, b) => {
        if (a.name > b.name) return 1;
        else return -1;
      });
    },
    sortedByQuantity: state => {
      return state.items.sort((a, b) => {
        if (a.quantity > b.quantity) return 1;
        else return -1;
      });
    }
  },
  actions: {
    async login({ dispatch }, form) {
      const { user } = await fb.auth.signInWithEmailAndPassword(
        form.email,
        form.password
      );
      dispatch("fetchUserProfile", user);
    },
    async fetchUserProfile({ commit }, user) {
      const userProfile = await fb.usersCollection.doc(user.uid).get();
      commit("setUserProfile", userProfile.data());
    },
    fetchUser({ commit }, user) {
      commit("updateAuth", user !== null);
      if (user) {
        commit("updateUserData", {
          email: user.email,
          uid: user.uid,
          displayName: user.displayName
        });
      }
    }
  },
  modules: {}
});
