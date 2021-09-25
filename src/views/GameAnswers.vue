<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto text-center">
        <div class="white--text text-h5 mb-5">{{ question }}</div>
        <v-card
          rounded="lg"
          elevation="10"
          outlined
          class="card white--text pa-3 mb-6"
        >
          <players-list :players="players" />
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
    question() {
      return "Hello world !";
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
</style>
