<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="5" xl="4" class="mr-lg-3">
        <v-card
          rounded="lg"
          elevation="10"
          class="card white--text py-3 px-6 pt-0 mb-10 scroll"
          height="65vh"
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
      </v-col>

      <v-col cols="12" sm="6" class="ml-lg-3 text-center white--text">
        <h2 class="mb-2">
          {{ currentQuestion ? currentQuestion.question : "" }}
        </h2>
        <div class="font-weight-bold mb-2">
          {{ $t("answers.right_answer") }} :
          <span
            :class="[
              !this.game.showResults ? 'blurry-text' : '',
              'text-h4 px-3',
              'font-weight-black',
            ]"
            >{{ currentQuestion ? currentQuestion.answer : "" }}</span
          >
        </div>
        <v-card class="mt-5" flat v-if="this.game.showResults">
          <v-toolbar color="#4a3c82" dark flat
            ><img
              class="d-flex justify-space-between align-center pl-2 mr-4"
              height="30px"
              src="@/assets/icons/explanationIcon.svg"
            />
            <h2>{{ $t("answers.explanations") }}</h2>
          </v-toolbar>
          <v-card-text>
            <div>
              <p class="text-body-1 text-justify mb-0">
                {{ currentQuestion.infos }}
              </p>
            </div>
          </v-card-text>
        </v-card>
        <!-- <div>
          <v-tooltip bottom v-if="this.game.showResults">
            <template v-slot:activator="{on, attrs}">
              <v-btn
                dark
                text
                large
                class="mb-3"
                @click="dialog = true"
                v-bind="attrs"
                v-on="on"
                >{{ $t("answers.know_more") }}</v-btn
              >
            </template>
            <span>{{ $t("answers.explanations") }}</span>
          </v-tooltip>
        </div> -->
        <!-- <div v-if="this.game.showResults">
          <v-img
            class="rounded elevation-10 mx-auto"
            lazy-src="loading"
            :aspect-ratio="16 / 9"
            width="27vw"
            :src="currentQuestion ? currentQuestion.imageURL : ''"
          ></v-img>
        </div> -->
        <v-btn
          v-if="game.showResults"
          large
          class="font-weight-bold secondary--text mt-10 mb-6"
          @click="nextRound"
          :disabled="!showNextEventButton || !isLeader"
        >
          <div v-if="this.currentRound === this.game.rounds">
            {{ $t("answers.final_results") }}
          </div>
          <div v-else>
            {{ $t("answers.next_round") }}
          </div>
        </v-btn>
        <v-btn
          v-else
          large
          :loading="loading"
          :disabled="!isLeader"
          @click="showResults"
          class="font-weight-bold secondary--text mt-10 mb-6"
          ><v-icon left>mdi-eye-outline</v-icon
          >{{ $t("answers.show_results") }}</v-btn
        >
      </v-col>
    </v-row>

    <!-- Winner dialog -->
    <v-dialog
      v-model="winnerAlert"
      persistent
      hide-overlay
      max-width="650px"
      content-class="elevation-0"
    >
      <div v-if="winner" class="text-center pa-4 font-weight-bold">
        <div class="mb-4">
          <v-avatar size="150" color="transparent">
            <img :src="winner.avatarURL" />
          </v-avatar>
        </div>
        <v-chip
          v-if="winnerScore === 2"
          x-large
          class="px-sm-8 gold-outline white--text"
        >
          <span class="font-weight-black">{{ winner.username }}</span
          >&nbsp; {{ $t("answers.tout_pile") }} ! (+{{
            winnerScore
          }}
          pts)</v-chip
        >
        <v-chip v-else x-large class="px-sm-8 gold-outline white--text"
          >{{ $t("answers.the_closest") }}
          <span class="font-weight-black">&nbsp;{{ winner.username }}</span> !
          (+{{ winnerScore }} pts)</v-chip
        >
      </div>
    </v-dialog>

    <!-- Explanations dialog -->
    <!-- <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-toolbar color="primary" dark
          ><img
            class="d-flex justify-space-between align-center pl-2 mr-4"
            height="30px"
            src="@/assets/icons/explanationIcon.svg"
          />
          <h2>{{ $t("answers.explanations") }}</h2>
        </v-toolbar>
        <v-card-text class="pb-0">
          <div class="mt-8">
            <p class="text-body-1 text-justify mb-0">
              {{ currentQuestion.infos }}
            </p>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialog = false">{{ $t("lobby.close") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
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
      dialog: false,
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
    isMuted() {
      return this.$store.state.muted;
    },
  },
  methods: {
    async showResults() {
      if (!this.isLeader) return;
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
      if (!this.isLeader) return;
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
        this.$store.dispatch("playAudio", this.audioWin);
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
    isMuted(value) {
      if (value) {
        this.audioWin.muted = true;
      } else {
        this.audioWin.muted = false;
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
