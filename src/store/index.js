import Vue from "vue";
import Vuex from "vuex";

import game from "./modules/game";
import player from "./modules/player";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    muted: false,
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
    SET_MUTED(state, payload) {
      state.muted = payload;
    },
  },
  actions: {
    playAudio({state}, audio) {
      state.muted ? (audio.muted = true) : null;
      audio.play();
    },
  },
  modules: {
    game,
    player,
  },
});
