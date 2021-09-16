import {db, fv} from "@/services/firebase";

const state = () => ({
  game: null,
});

const mutations = {
  SET_GAME(state, payload) {
    state.game = payload;
  },
};

const actions = {
  async createGame({dispatch, rootState}) {
    const gameData = {
      answers: [],
      currentRound: 0,
      leaderId: rootState.player.player.id,
      players: [rootState.player.player],
      questions: [],
      rounds: 10,
      scores: [],
      started: false,
      timer: 30,
    };
    const game = await db.collection("games").add(gameData);
    await dispatch("getGame", game.id);
    await dispatch("bindGame", game.id);
    // commit("SET_GAME", {id: game.id, ...gameData});
  },

  async updateGame({state}, gameData) {
    return await db.collection("games").doc(state.game.id).update(gameData);
  },

  async startGame({dispatch}, gameData) {
    // Generate an array of random numbers
    const max = gameData.rounds;
    let random = [];
    for (let i = 0; i < max; i++) {
      let tmp = Math.floor(Math.random() * max + 1);
      if (random.indexOf(tmp) === -1 && tmp !== 0) {
        random.push(tmp);
      } else i--;
    }
    // Get random questions
    const questions = [];
    // for (const ran of random) {
    //   const querySnapshot = await db
    //     .collection("questions")
    //     .where("id", "==", ran)
    //     .get();
    //   console.log(querySnapshot);
    //   querySnapshot.forEach((document) => {
    //     questions.push(document.data());
    //   });
    // }
    const querySnapshot = await db
      .collection("questions")
      .where("id", ">=", random)
      .get();

    querySnapshot.forEach((document) => {
      questions.push(document.data());
    });

    const data = {
      currentRound: 1,
      started: true,
      questions: questions,
      ...gameData,
    };

    await dispatch("updateGame", data);
  },

  async bindGame({commit}, gameId) {
    return await db
      .collection("games")
      .doc(gameId)
      .onSnapshot((game) => {
        commit("SET_GAME", {id: game.id, ...game.data()});
      });
  },

  async getGame({commit}, gameId) {
    const game = await db.collection("games").doc(gameId).get();
    commit("SET_GAME", {id: game.id, ...game.data()});
  },

  async addPlayer({rootState}, gameId) {
    await db
      .collection("games")
      .doc(gameId)
      .update({
        players: fv.arrayUnion(rootState.player.player),
      });
  },

  async removePlayer({state}, player) {
    await db
      .collection("games")
      .doc(state.game.id)
      .update({
        players: fv.arrayRemove(player),
      });
  },

  async addAnswer({state}, answer) {
    db.collection("games")
      .doc(state.game.id)
      .update({
        answers: fv.arrayUnion(answer),
      });
  },

  async addScore({state}, score) {
    db.collection("games")
      .doc(state.game.id)
      .update({
        scores: fv.arrayUnion(score),
      });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
