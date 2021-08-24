import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Onboarding from "../views/Onboarding.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/",
    name: "Onboarding",
    component: Onboarding,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
