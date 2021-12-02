<template>
  <v-container class="white--text">
    <!-- <v-row justify="center">
      <v-col cols="10" class="pl-0">
        
      </v-col>
    </v-row> -->
    <v-row justify="center">
      <v-col cols="6" md="8" class="mr-3">
        <!-- <h1 class="px-10">{{ game.currentRound }}/{{ game.rounds }}</h1> -->
        <h2 class="text-center select-disabled">
          <span class="pr-2">{{ game.currentRound }}/{{ game.rounds }}</span
          >{{ currentQuestion ? currentQuestion.question : "" }}
        </h2>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-5 mb-3">
      <h3>
        <count-down ref="countdown" :timer="game.timer" @answered="nextRound" />
      </h3>
    </v-row>
    <v-row justify="center" class="mb-10">
      <v-col cols="5">
        <v-img
          class="rounded elevation-10"
          lazy-src="loading"
          :aspect-ratio="16 / 9"
          :src="currentQuestion ? currentQuestion.imageURL : ''"
        ></v-img>
      </v-col>
    </v-row>
    <form @submit.prevent="validate">
      <v-row justify="center" align="center">
        <v-col cols="5">
          <v-text-field
            v-model="formattedAnswer"
            :label="$t('round.response')"
            :suffix="currentQuestion ? currentQuestion.unit : ''"
            solo
            hide-details
            autofocus
            :disabled="validated"
          ></v-text-field>
        </v-col>
        <v-col cols="auto" class="pl-0">
          <v-btn
            height="48px"
            color="success"
            type="submit"
            :disabled="validated"
          >
            {{ $t("round.validate") }}
          </v-btn>
          <span class="ml-2"
            >{{ validatedAnswers }}/{{ game.players.length }}</span
          >
        </v-col>
      </v-row>
    </form>
  </v-container>
</template>
<script>
import {mapState} from "vuex";
import CountDown from "@/components/global/CountDown";
export default {
  name: "GameRound",
  components: {
    CountDown,
  },
  data() {
    return {
      validated: false,
      answer: "",
      validatedTimestamp: null,
      audioValidated: new Audio(require("@/assets/sounds/validated.mp3")),
    };
  },
  computed: {
    ...mapState("game", ["game"]),
    currentQuestion() {
      return this.game.questions[this.game.currentRound - 1];
    },
    formattedAnswer: {
      // getter
      get: function () {
        return this.answer;
      },
      // setter
      set: function (newValue) {
        if (newValue.length > 4) {
          this.answer = parseFloat(
            newValue.replace(/\s+/g, ""),
          ).toLocaleString();
        } else {
          this.answer = newValue;
        }
      },
    },
    validatedAnswers() {
      const currentRoundAnswers = this.game.answers.filter(
        (answer) => answer.round === this.game.currentRound,
      );
      return currentRoundAnswers.length;
    },
  },
  methods: {
    async validate() {
      this.validated = true;
      this.validatedTimestamp = Date.now();
      this.audioValidated.volume = 0.2;
      this.$store.dispatch("playAudio", this.audioValidated);
      await this.addAnswer();
    },
    async nextRound() {
      if (!this.validated) {
        this.validatedTimestamp = Date.now();
        await this.addAnswer();
      }
      this.$router.push("/answers");
    },
    async addAnswer() {
      let answer = this.answer.replace(/\s+/g, "");
      if (!this.answer || isNaN(answer)) answer = 0;
      const finalAnswer = {
        answer: parseFloat(answer),
        playerId: this.$store.state.player.player.id,
        round: this.game.currentRound,
        timestamp: this.validatedTimestamp,
      };
      await this.$store.dispatch("game/addAnswer", finalAnswer);
    },
  },
  watch: {
    async validatedAnswers(value) {
      if (value === this.game.players.length) {
        await this.nextRound();
      }
    },
  },

  beforeRouteLeave(to, from, next) {
    if (to.fullPath !== "/answers") {
      this.$refs.countdown.stopSound();
    }
    next();
  },
};
</script>
<style scoped>
.select-disabled {
  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
}
</style>
