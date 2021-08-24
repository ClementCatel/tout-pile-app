import {db} from "@/services/firebase";

const state = () => ({
  player: null,
});

const mutations = {
  SET_PLAYER(state, payload) {
    state.player = payload;
  },
};

const actions = {
  async createPlayer({commit}, playerData) {
    const player = await db.collection("players").add(playerData);
    commit("SET_PLAYER", player.data());
    localStorage.playerId = player.id;
  },

  async getPlayer({commit}, userId) {
    const player = await db.collection("players").doc(userId).get();
    commit("SET_PLAYER", player.data());
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
