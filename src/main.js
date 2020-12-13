import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "./assets/tailwind.css";
import store from "./store";
import { firestorePlugin } from "vuefire";
import { auth } from "./firebase";

Vue.use(firestorePlugin);

Vue.config.productionTip = false;

let app;
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      el: "#app",
      router,
      store,
      render: h => h(App)
    });
  }

  if (user) {
    store.dispatch("fetchUserProfile", user);
  }
});
