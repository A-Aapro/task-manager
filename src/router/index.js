import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    replace: true,
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/HomeView",
    name: "HomeView",
    replace: true,
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/UserView",
    name: "UserView",
    meta: { authRequired: true },
    component: () => import("@/views/UserView.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("@/views/PageNotFound.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeResolve((to, from, next) => {
  if (to.meta.authRequired && !localStorage.getItem("user")) {
    return next("/");
  } else {
    return next();
  }
});
export default router;
