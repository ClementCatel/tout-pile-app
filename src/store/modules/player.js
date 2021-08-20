import {db} from "@/services/firebase";

export const state = () => ({
  player: null,
});

export const mutations = {
  SET_PLAYER(state, payload) {
    state.player = payload;
  },
};

export const actions = {
  async createPlayer({commit}, playerData) {
    const player = await db.collection("players").add(playerData);
    commit("SET_PLAYER", player);
    localStorage.playerId = player.id;
  },

  async getPlayer({commit}, userId) {
    const player = await db.collection("players").doc(userId).get();
    commit("SET_PLAYER", player);
  },
};
