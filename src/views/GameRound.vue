<template>
  <v-container class="white--text">
    <v-row justify="center">
      <v-col cols="10" class="pl-0">
        <h1 class="px-10">{{ game.currentRound }}/{{ game.rounds }}</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="6" md="8" class="mr-3">
        <h2 class="centerQst">
          {{ game.questions[game.currentRound - 1].question }}
        </h2>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-5 mb-3">
      <h3><count-down :timer="game.timer" @answered="nextRound" /></h3>
    </v-row>
    <v-row justify="center" class="mb-10">
      <v-col cols="5">
        <v-img
          class="rounded elevation-10"
          lazy-src="loading"
          :aspect-ratio="16 / 9"
          :src="game.questions[game.currentRound - 1].imageURL"
        ></v-img>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="5">
        <v-text-field
          v-model="answer"
          :label="$t('round.response')"
          type="number"
          value=""
          :suffix="game.questions[game.currentRound - 1].unit"
          solo
          hide-details
          :disabled="validated"
        ></v-text-field>
      </v-col>
      <v-col cols="auto" class="pl-0">
        <v-btn
          height="48px"
          color="success"
          @click="validated = true"
          :disabled="validated"
        >
          {{ $t("round.validate") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import {mapState} from "vuex";
import CountDown from "@/components/global/CountDown";
export default {
  components: {
    CountDown,
  },
  data() {
    return {
      validated: false,
      answer: null,
    };
  },
  computed: {
    ...mapState("game", ["game"]),
  },
  methods: {
    async nextRound() {
      let answer = this.answer;
      if (!this.answer || isNaN(this.answer)) answer = 0;
      const finalAnswer = {
        answer: answer,
        playerId: this.$store.state.player.player.id,
        round: this.game.currentRound,
      };
      await this.$store.dispatch("game/addAnswer", finalAnswer);
      this.$router.push("/answers");
    },
  },
};
</script>
<style scoped>
.centerQst {
  text-align: center;
}
</style>
