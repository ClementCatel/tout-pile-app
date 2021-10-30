<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" lg="4" md="6" sm="8" class="text-center white--text">
        <h2 class="my-5">
          {{ currentQuestion ? currentQuestion.question : "" }}
        </h2>
        <div class="font-weight-bold">
          {{ $t("answers.right_answer") }} :
          <span
            :class="[
              !this.game.showResults ? 'blurry-text' : '',
              'text-h4 px-3',
            ]"
            >{{ currentQuestion ? currentQuestion.answer : "" }}</span
          >
        </div>
        <v-card
          rounded="lg"
          elevation="10"
          outlined
          class="card white--text py-3 px-6 mt-4 pt-0 mb-10 scroll"
          :height="height"
        >
          <v-card-title
            class="justify-center text-h5 font-weight-bold text-uppercase"
          >
            {{ $t("answers.answers") }}
          </v-card-title>
          <players-list
            v-if="answersDictionnary"
            :players="sortedPlayers"
            :answers="answersDictionnary"
            :scores="scoresDictionnary"
            :show-points="game.showResults"
          />
        </v-card>
        <v-btn
          v-if="game.showResults && isLeader"
          large
          class="font-weight-bold secondary--text"
          @click="nextRound"
          :disabled="!showNextEventButton"
        >
          <div v-if="this.currentRound === this.game.rounds">
            {{ $t("answers.final_results") }}
          </div>
          <div v-else>
            {{ $t("answers.next_round") }}
          </div>
        </v-btn>
        <v-btn
          v-else-if="isLeader"
          large
          :loading="loading"
          @click="showResults"
          class="font-weight-bold secondary--text"
          ><v-icon left>mdi-eye-outline</v-icon
          >{{ $t("answers.show_results") }}</v-btn
        >
      </v-col>
    </v-row>

    <v-dialog
      v-model="winnerAlert"
      transition="dialog-top-transition"
      persistent
      hide-overlay
      max-width="500px"
      content-class="elevation-0"
    >
      <div v-if="winner" class="text-center pa-4 font-weight-bold">
        <div class="mb-4">
          <v-avatar size="150" color="transparent">
            <img :src="winner.avatarURL" />
          </v-avatar>
        </div>
        <v-chip x-large class="px-8 gold-outline white--text"
          >{{ $t("answers.the_closest") }} {{ winner.username }} ! (+{{
            winnerScore
          }}
          pts)</v-chip
        >
      </div>
    </v-dialog>
  </v-container>
</template>

<script>
import PlayersList from "@/components/global/PlayersList";
import {mapState} from "vuex";
import confetti from "canvas-confetti";

export default {
  name: "GameAnswers",
  components: {
    PlayersList,
  },
  data() {
    return {
      loading: false,
      winnerAlert: false,
      winner: null,
      winnerScore: 0,
      showNextEventButton: false,
      audioWin: new Audio(require("@/assets/sounds/win.mp3")),
    };
  },
  computed: {
    ...mapState("game", ["game"]),
    currentRound() {
      return this.game.currentRound;
    },
    currentQuestion() {
      return this.game.questions[this.game.currentRound - 1];
    },
    players() {
      return this.game?.players || [];
    },
    sortedPlayers() {
      const playersToSort = [...this.players];
      const playersScores = this.scoresDictionnary;
      return playersToSort.sort((a, b) => {
        const scoreB = playersScores[b.id] || 0;
        const scoreA = playersScores[a.id] || 0;
        if (scoreB < scoreA) {
          return -1;
        } else if (scoreB === scoreA) {
          if (this.getTotalTimestamp(b.id) < this.getTotalTimestamp(a.id)) {
            return 1;
          }
        }
        return 1;
      });
    },

    playerAnswers() {
      return this.game?.answers.filter((answer) => {
        return answer.round === this.game.currentRound;
      });
    },
    answersDictionnary() {
      return this.game?.answers.reduce((obj, item) => {
        obj[item["playerId"]] = {};
        if (item.round === this.game.currentRound) {
          obj[item["playerId"]] = item;
          return obj;
        }
        return obj;
      }, {});
    },
    scoresDictionnary() {
      return this.game?.scores.reduce((obj, item) => {
        obj[item["playerId"]]
          ? (obj[item["playerId"]] = obj[item["playerId"]] + item.score)
          : (obj[item["playerId"]] = item.score);
        return obj;
      }, {});
    },
    isLeader() {
      return (
        this.$store.state.player.player?.id ===
        this.$store.state.game.game?.leaderId
      );
    },
    gameShowResults() {
      return this.game.showResults;
    },

    height() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 100;
        case "sm":
          return 200;
        case "md":
          return 300;
        case "lg":
          return 400;
        case "xl":
          return 500;
        default:
          return 500;
      }
    },
  },
  methods: {
    async showResults() {
      this.loading = true;
      await this.calculateScores();
      await this.$store.dispatch("game/updateGame", {
        showResults: true,
      });
      this.loading = false;
    },
    async calculateScores() {
      const closest = this.getClosestPlayer();
      await this.$store.dispatch("game/addScore", {
        playerId: closest.playerId,
        round: this.game.currentRound,
        score: this.winnerScore,
      });
    },
    async nextRound() {
      await this.$store.dispatch("game/updateGame", {
        currentRound: this.game.currentRound + 1,
        showResults: false,
      });
    },

    getTotalTimestamp(id) {
      let total = 0;
      this.playerAnswers.forEach((element) => {
        if (element.id === id) {
          total += element.timestamp;
        }
      });
      return total;
    },
    getClosestPlayer() {
      const correctAnswer = this.currentQuestion
        ? this.currentQuestion.answer
        : 0;
      const closest = this.playerAnswers.reduce((a, b) => {
        if (
          Math.abs(b.answer - correctAnswer) <
          Math.abs(a.answer - correctAnswer)
        ) {
          return b;
        } else if (
          Math.abs(b.answer - correctAnswer) ===
          Math.abs(a.answer - correctAnswer)
        ) {
          if (b.timestamp < a.timestamp) {
            return b;
          }
        }
        return a;
      });
      this.winner = this.players.find(
        (player) => player.id === closest.playerId,
      );
      this.winnerScore = closest.answer === correctAnswer ? 2 : 1;

      return closest;
    },
  },
  watch: {
    currentRound(val, old) {
      if (val === old + 1) {
        if (old === this.game.rounds) {
          this.$router.push("/results");
        } else {
          this.$router.push("/round");
        }
      }
    },
    gameShowResults(value) {
      if (value) {
        this.audioWin.play();
        this.getClosestPlayer();
        this.winnerAlert = true;
        confetti({
          particleCount: 100,
          spread: 70,
          origin: {y: 0.6},
        });
        setTimeout(() => {
          this.winnerAlert = false;
          this.showNextEventButton = true;
        }, 3500);
      }
    },
  },
};
</script>

<style scoped>
.card {
  background-color: #4a3c82;
}

.blurry-text {
  color: transparent;
  text-shadow: 0 0 14px white;
  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
}

.gold-outline {
  background-color: #7454f9 !important;
  border: 2px solid #ffd700;
}
</style>
