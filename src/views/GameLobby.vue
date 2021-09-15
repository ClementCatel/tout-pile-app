<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10" class="pl-0">
        <v-btn
          class="px-10 font-weight-bold white--text mb-5"
          outlined
          @click="leaveGame"
          ><v-icon left>mdi-arrow-left</v-icon> {{ $t("lobby.return") }}</v-btn
        >
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="4" class="mr-3">
        <v-card
          rounded="lg"
          elevation="10"
          outlined
          class="card white--text pa-3"
        >
          <v-card-title
            class="justify-center text-h4 font-weight-bold text-uppercase"
          >
            {{ $t("lobby.players") }}
          </v-card-title>
          <players-list :players="players" @kick="kickPlayer" />
        </v-card>
      </v-col>

      <v-col cols="6" class="ml-3">
        <v-card
          rounded="lg"
          elevation="10"
          outlined
          class="card white--text pa-3"
        >
          <v-card-title
            class="justify-center text-h4 font-weight-bold text-uppercase"
          >
            {{ $t("lobby.settings") }}
          </v-card-title>
          <div class="mx-6 mb-3">
            <v-row>
              <div class="col-4 text-h5">
                {{ $t("lobby.timer") }}
              </div>
              <v-col>
                <v-select
                  v-model="timerSelected"
                  :items="timerItems"
                  :disabled="!isLeader"
                  suffix="s"
                  solo
                  hide-details
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <div class="col-4 text-h5">
                {{ $t("lobby.rounds") }}
              </div>
              <v-col>
                <v-select
                  v-model="roundsSelected"
                  :items="roundsItems"
                  :disabled="!isLeader"
                  solo
                  hide-details
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <div class="col-4 text-h5">
                {{ $t("lobby.categories") }}
              </div>
              <v-col>
                <v-autocomplete
                  v-model="categoriesSelected"
                  :items="categoriesItems"
                  :disabled="!isLeader"
                  chips
                  multiple
                  solo
                  clearable
                  hide-details
                ></v-autocomplete>
              </v-col>
            </v-row>
          </div>
        </v-card>

        <div class="d-flex justify-center mt-16">
          <v-btn
            large
            class="mr-3 font-weight-bold secondary--text"
            @click="copyLink"
            ><v-icon left>mdi-link-variant</v-icon
            >{{ $t("lobby.copyLink") }}</v-btn
          >
          <v-btn
            v-if="isLeader"
            large
            class="ml-3 font-weight-bold secondary--text"
            @click="startGame"
            ><v-icon left>mdi-play-outline</v-icon
            >{{ $t("lobby.startGame") }}</v-btn
          >
        </div>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :timeout="2000" content-class="text-center">
      {{ $t("lobby.link_copied") }}
    </v-snackbar>
  </v-container>
</template>

<script>
import PlayersList from "@/components/global/PlayersList";
import {mapState} from "vuex";

export default {
  name: "Home",
  components: {
    PlayersList,
  },
  data() {
    return {
      timerItems: [15, 30, 45],
      timerSelected: null,
      roundsItems: [10, 15, 20, 25],
      roundsSelected: null,
      categoriesItems: [
        "History",
        "Sport",
        "Geography",
        "Anime",
        "Music",
        "Video games",
      ],
      categoriesSelected: [],
      snackbar: false,
    };
  },
  computed: {
    ...mapState("game", ["game"]),
    players() {
      return this.game?.players || [];
    },
    isLeader() {
      return (
        this.$store.state.player.player.id ===
        this.$store.state.game.game.leaderId
      );
    },
  },
  methods: {
    async kickPlayer(player) {
      await this.$store.dispatch("game/removePlayer", player);
    },
    startGame() {
      console.log("Start game");
    },
    copyLink() {
      // dev link
      const link = `http://192.168.1.36:8080/?game=${this.game.id}`;
      // production link
      //const link = "";
      const clipboardData =
        window.clipboardData ||
        event.originalEvent?.clipboardData ||
        navigator.clipboard;
      clipboardData.writeText(link);
      this.snackbar = true;
    },
    leaveGame() {
      console.log("Leave game");
      this.$router.push("/");
    },
    prefillForm() {
      this.timerSelected = this.game.timer;
      this.roundsSelected = this.game.rounds;
      this.categoriesSelected = [];
    },
  },
  watch: {
    // Check if player has been kicked
    players(val) {
      if (val.length > 0) {
        if (
          !val.some(
            (player) => player.id === this.$store.state.player.player.id,
          )
        ) {
          this.$router.push("/");
        }
      }
    },
  },
  created() {
    if (this.game) {
      this.prefillForm();
    }
  },
};
</script>
<style scoped>
.card {
  background-color: #4a3c82;
}
</style>
