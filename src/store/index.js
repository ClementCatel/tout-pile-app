import Vue from "vue";
import Vuex from "vuex";

import game from "./modules/game";
import player from "./modules/player";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
  },
  actions: {},
  modules: {
    game,
    player,
  },
});
