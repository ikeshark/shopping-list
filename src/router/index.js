import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

import { auth } from "../firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/"
  },
  {
    path: "/user",
    name: "User",
    component: () => import("../views/User.vue")
  },
  {
    path: "/list",
    name: "List",
    meta: { requiresAuth: true },
    component: () => import("../views/List.vue")
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: "/edit",
    name: "Edit",
    meta: { requiresAuth: true },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/Edit.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);

  if (requiresAuth && !auth.currentUser) {
    next("/user");
  } else {
    next();
  }
});

export default router;
