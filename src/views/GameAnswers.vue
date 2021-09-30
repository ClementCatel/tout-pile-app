<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="4" class="text-center white--text">
        <div class="text-h5 my-5">
          {{ game.questions[game.currentRound - 1].question }}
        </div>
        <div>
          {{ $t("answers.right_answer") }} :
          <span class="text-h4 blurry-text px-3">{{
            game.questions[game.currentRound - 1].answer
          }}</span>
        </div>
        <v-card
          rounded="lg"
          elevation="10"
          outlined
          class="card white--text pa-3 my-6"
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
    players() {
      return this.game?.players || [];
    },
    answersDictionnary() {
      const dict = {};
      this.game?.answers.forEach((answer) => {
        if (answer.round === this.game.currentRound) {
          dict[answer.playerId] = answer;
        }
      });
      return dict;
    },
    isLeader() {
      return (
        this.$store.state.player.player?.id ===
        this.$store.state.game.game?.leaderId
      );
    },
  },
  methods: {
    showResults() {
      console.log("show results");
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
}
</style>
