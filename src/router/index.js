import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import Onboarding from "../views/Onboarding.vue";
import GameLobby from "../views/GameLobby.vue";
import GameAnswers from "../views/GameAnswers.vue";
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
    meta: {requiresGameId: true},
    component: GameLobby,
  },
  {
    path: "/answers",
    name: "GameAnswers",
    meta: {requiresGameId: true},
    component: GameAnswers,
  },
  {
    path: "/round",
    name: "GameRound",
    meta: {requiresGameId: true},
    component: GameRound,
  },
  {
    path: "/results",
    name: "FinalResults",
    meta: {requiresGameId: true},
    component: GameFinalResults,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresGameId = to.matched.some((x) => x.meta.requiresGameId);

  if (requiresGameId && !store.state.game.game) {
    next("/");
  } else {
    next();
  }
});

export default router;
