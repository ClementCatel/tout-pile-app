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
            class="justify-center text-h5 font-weight-bold text-uppercase"
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
            class="justify-center text-h5 font-weight-bold text-uppercase"
          >
            {{ $t("lobby.settings") }}
          </v-card-title>
          <div class="mx-6 mb-3">
            <v-row align="center">
              <div class="col-6 text-h5">
                <v-icon color="white" left large>mdi-clock-fast</v-icon
                >{{ $t("lobby.timer") }}
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
              <div class="col-6 text-h5">
                <v-icon color="white" left large>mdi-repeat</v-icon
                >{{ $t("lobby.rounds") }}
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
              <div class="col-6 text-h5">
                <v-icon color="white" left large>mdi-label-outline</v-icon
                >{{ $t("lobby.categories") }}
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
            :loading="loading"
            class="ml-3 font-weight-bold secondary--text"
            @click="startGame"
            ><v-icon left>mdi-play-outline</v-icon
            >{{ $t("lobby.startGame") }}</v-btn
          >
        </div>
      </v-col>
    </v-row>

    <v-overlay absolute :opacity="0.5" :value="overlay">
      <div id="readyGo">
        <span class="nums font-weight-bold" :key="countDown">{{
          countDown
        }}</span>
      </div>
    </v-overlay>

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
      roundsItems: [5, 10],
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
      overlay: false,
      countDown: 3,
      loading: false,
    };
  },
  computed: {
    ...mapState("game", ["game"]),
    players() {
      return this.game?.players || [];
    },
    started() {
      return this.game?.started;
    },
    isLeader() {
      return (
        this.$store.state.player.player.id ===
        this.$store.state.game.game?.leaderId
      );
    },
  },
  methods: {
    async kickPlayer(player) {
      await this.$store.dispatch("game/removePlayer", player);
    },
    async startGame() {
      console.log("Start game");
      this.loading = true;
      await this.$store.dispatch("game/startGame", {
        timer: this.timerSelected,
        rounds: this.roundsSelected,
        categories: this.categoriesSelected,
      });
      this.loading = false;
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
    async leaveGame() {
      await await this.$store.dispatch(
        "game/removePlayer",
        this.$store.state.player.player,
      );
      // this.$router.push("/");
    },
    prefillForm() {
      this.timerSelected = this.game.timer;
      this.roundsSelected = this.game.rounds;
      this.categoriesSelected = [];
    },
    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000);
      }
    },
  },
  watch: {
    // Check if player has been kicked
    players(val) {
      if (val.length >= 0) {
        if (
          !val.some(
            (player) => player.id === this.$store.state.player.player.id,
          )
        ) {
          this.$router.push("/");
        }
      }
    },
    started(val) {
      if (val) {
        this.overlay = true;
        this.countDownTimer();
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

@keyframes count {
  0% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

.nums {
  font-size: 10em;
  height: auto;
  position: absolute;
  top: 0;
  right: 0;
  animation: count 0.1s cubic-bezier(0.1, 0.1, 1, 1) 1;
}
</style>
