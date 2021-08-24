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
  async createGame({commit, rootState}) {
    const game = await db.collection("games").add({
      answers: [],
      currentRound: 0,
      leaderId: rootState.player.player.id,
      players: [rootState.player.player],
      questions: [],
      rounds: 10,
      scores: [],
      started: false,
      timer: 30,
    });
    commit("SET_GAME", game.data());
  },

  async updateGame({state}, gameData) {
    return await db.collection("games").doc(state.game.id).update(gameData);
  },

  async startGame({state, dispatch}) {
    // Generate an array of random numbers
    const max = state.game.rounds;
    let random = [];
    for (let i = 0; i < max; i++) {
      let tmp = Math.floor(Math.random() * max + 1);
      if (random.indexOf(tmp) === -1 && tmp !== 0) {
        random.push(tmp);
      } else i--;
    }
    // Get random questions
    const questions = [];
    const querySnapshot = await db
      .collection("questions")
      .where("id", "in", random)
      .get();

    querySnapshot.forEach((document) => {
      questions.push(document.data());
    });

    const data = {
      currentRound: 1,
      started: true,
      questions: questions,
    };

    await dispatch("updateGame", data);
  },

  async bindGame({commit}, gameId) {
    db.collection("games")
      .doc(gameId)
      .onSnaphot((document) => {
        commit("SET_GAME", document.data());
      });
  },

  async addPlayer({state}, player) {
    db.collection("games")
      .doc(state.game.id)
      .update({
        players: fv.arrayUnion(player),
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
