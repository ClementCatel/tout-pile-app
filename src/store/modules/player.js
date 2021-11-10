import {db, auth} from "@/services/firebase";

const state = () => ({
  player: null,
});

const mutations = {
  SET_PLAYER(state, payload) {
    state.player = payload;
  },
};

const actions = {
  async signInAnonymously({dispatch}, playerData) {
    if (auth.currentUser) {
      return await dispatch("editPlayer", playerData);
    }
    return await dispatch("createPlayer", playerData);
  },

  async createPlayer({commit}, playerData) {
    await auth.signInAnonymously();
    const {uid} = auth.currentUser;
    await db.collection("players").doc(uid).set(playerData);
    commit("SET_PLAYER", {id: uid, ...playerData});
    // localStorage.playerId = player.id;
  },

  async editPlayer({dispatch}, playerData) {
    const {uid} = auth.currentUser;
    await db.collection("players").doc(uid).update(playerData);
    await dispatch("getPlayer", uid);
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
