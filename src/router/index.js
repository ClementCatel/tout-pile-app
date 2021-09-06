import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Onboarding from "../views/Onboarding.vue";
import GameLobby from "../views/GameLobby.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/onboarding",
    name: "Onboarding",
    component: Onboarding,
  },
  {
    path: "/lobby",
    name: "GameLobby",
    component: GameLobby,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
