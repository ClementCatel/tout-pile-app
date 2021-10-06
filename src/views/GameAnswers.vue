<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="4" class="text-center white--text">
        <h2 class="my-5">
          {{ currentQuestion.question }}
        </h2>
        <div class="font-weight-bold">
          {{ $t("answers.right_answer") }} :
          <span
            :class="[
              !this.game.showResults ? 'blurry-text' : '',
              'text-h4 px-3',
            ]"
            >{{ currentQuestion.answer }}</span
          >
        </div>
        <v-card
          rounded="lg"
          elevation="10"
          outlined
          class="card white--text py-3 px-6 my-6"
        >
          <v-card-title
            class="justify-center text-h5 font-weight-bold text-uppercase"
          >
            {{ $t("answers.answers") }}
          </v-card-title>
          <players-list :players="players" :answers="answersDictionnary" />
        </v-card>
        <v-btn
          v-if="isLeader"
          large
          :loading="loading"
          @click="showResults"
          class="font-weight-bold secondary--text"
          ><v-icon left>mdi-eye-outline</v-icon
          >{{ $t("answers.show_results") }}</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PlayersList from "@/components/global/PlayersList";
import {mapState} from "vuex";

export default {
  name: "GameAnswers",
  components: {
    PlayersList,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState("game", ["game"]),
    currentQuestion() {
      return this.game.questions[this.game.currentRound - 1];
    },
    players() {
      return this.game?.players || [];
    },
    playerAnswers() {
      return this.game?.answers.filter((answer) => {
        return answer.round === this.game.currentRound;
      });
    },
    answersDictionnary() {
      return this.game?.answers.reduce((obj, item) => {
        if (item.round === this.game.currentRound) {
          obj[item["playerId"]] = item;
          return obj;
        }
      }, {});
    },
    isLeader() {
      return (
        this.$store.state.player.player?.id ===
        this.$store.state.game.game?.leaderId
      );
    },
  },
  methods: {
    async showResults() {
      this.loading = true;
      await this.$store.dispatch("game/updateGame", {
        showResults: true,
      });
      this.calculateScores();
      this.loading = false;
    },
    calculateScores() {
      const correctAnswer = this.currentQuestion.answer;
      const closest = this.playerAnswers.reduce((a, b) => {
        return Math.abs(b.answer - correctAnswer) <
          Math.abs(a.answer - correctAnswer)
          ? b
          : a;
      });
      console.log(closest);
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
</style>
