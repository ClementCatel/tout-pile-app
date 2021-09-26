import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Onboarding from "../views/Onboarding.vue";
import GameLobby from "../views/GameLobby.vue";
import GameAnswers from "../views/GameAnswers.vue";
import GameRound from "../views/GameRound.vue";

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
  {
    path: "/lobby",
    name: "GameLobby",
    component: GameLobby,
  },
  {
    path: "/answers",
    name: "GameAnswers",
    component: GameAnswers,
  },
  {
    path: "/round",
    name: "GameRound",
    component: GameRound,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
