import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Onboarding from "../views/Onboarding.vue";
import GameLobby from "../views/GameLobby.vue";
import GameRound from "../views/GameRound.vue";
import GameFinalResults from "../views/GameFinalResults.vue";

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
    path: "/round",
    name: "GameRound",
    component: GameRound,
  },
  {
    path: "/results",
    name: "FinalResults",
    component: GameFinalResults,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
