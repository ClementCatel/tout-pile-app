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
    commit("SET_PLAYER", {id: player.id, ...playerData});
    localStorage.playerId = player.id;
  },

  async editPlayer({dispatch}, playerData) {
    await db
      .collection("players")
      .doc(localStorage.playerId)
      .update(playerData);
    await dispatch("getPlayer", localStorage.playerId);
  },

  async getPlayer({commit}, playerId) {
    const player = await db.collection("players").doc(playerId).get();
    commit("SET_PLAYER", {id: player.id, ...player.data()});
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
