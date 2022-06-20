<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="4" class="mr-sm-3">
        <v-card
          rounded="lg"
          elevation="10"
          class="card white--text pa-3 scroll"
          height="65vh"
        >
          <v-card-title
            class="justify-center text-h5 font-weight-bold text-uppercase"
          >
            {{ $t("lobby.players") }}
            ({{ players.length }}/10)
          </v-card-title>
          <players-list :players="players" @kick="kickPlayer" />
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" class="ml-sm-3">
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
          <div class="mx-6 my-3">
            <v-row align="center" class="mb-3">
              <div class="col-6 text-h5 d-flex align-center">
                <img
                  class="pr-3"
                  height="30px"
                  src="@/assets/icons/timerIconLobby.svg"
                />
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
            <v-row align="center" class="mb-3">
              <div class="col-6 text-h5 d-flex align-center">
                <img
                  class="pr-3"
                  height="30px"
                  src="@/assets/icons/toutPileIconLobby.svg"
                />
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
            <!-- <v-row align="center">
              <div class="col-6 text-h5">
                <span class="pr-2">🔖</span>{{ $t("lobby.categories") }}
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
            </v-row> -->
          </div>
        </v-card>

        <div class="d-flex justify-center mt-16 mb-5">
          <v-btn
            large
            class="mr-3 font-weight-bold secondary--text pl-2"
            @click="copyLink"
            ><img
              class="mr-2"
              height="20px"
              src="@/assets/icons/shareLinkIconLobby.svg"
            />{{ $t("lobby.copyLink") }}</v-btn
          >
          <v-btn
            v-if="isLeader"
            large
            :loading="loading"
            class="ml-3 font-weight-bold secondary--text pl-2"
            @click="startGame"
            ><img
              class="mr-2"
              height="20px"
              src="@/assets/icons/playIcon.svg"
            />{{ $t("lobby.startGame") }}</v-btn
          >
        </div>
      </v-col>
    </v-row>

    <v-overlay :opacity="0.5" :value="overlay">
      <div class="nums font-weight-bold" :key="countDown">{{ countDown }}</div>
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
  name: "GameLobby",
  components: {
    PlayersList,
  },
  data() {
    return {
      timerItems: [20, 30, 40, 50, 60],
      timerSelected: null,
      roundsItems: [10, 20, 30],
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
      countDownTimeout: null,
      audioDisconnect: new Audio(require("@/assets/sounds/disconnect.mp3")),
      audioConnect: new Audio(require("@/assets/sounds/connect.mp3")),
      audioStart: new Audio(require("@/assets/sounds/start.mp3")),
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
      if (this.$store.state.player.player) {
        return (
          this.$store.state.player.player.id ===
          this.$store.state.game.game?.leaderId
        );
      }
      return false;
    },
  },
  methods: {
    async kickPlayer(player) {
      await this.$store.dispatch("game/removePlayer", player);
    },
    async startGame() {
      this.loading = true;
      try {
        await this.$store.dispatch("game/startGame", {
          timer: this.timerSelected,
          rounds: this.roundsSelected,
          categories: this.categoriesSelected,
        });
      } catch (error) {
        await this.$store.dispatch("game/unsubscribe");
      }
      this.loading = false;
    },
    copyLink() {
      // dev link
      let link = `https://tout-pile.com/?game=${this.game.id}`;
      //const link = "";
      const isDevelopment = process.env.NODE_ENV === "development";
      if (isDevelopment) link = `http://localhost:8080/?game=${this.game.id}`;
      const clipboardData =
        window.clipboardData ||
        event.originalEvent?.clipboardData ||
        navigator.clipboard;
      clipboardData.writeText(link);
      this.snackbar = true;
    },
    prefillForm() {
      this.timerSelected = this.game.timer;
      this.roundsSelected = this.game.rounds;
      this.categoriesSelected = [];
    },
    countDownTimer() {
      this.$store.dispatch("playAudio", this.audioStart);
      if (this.countDown > 0 || this.countDown === "Go !") {
        this.countDownTimeout = setTimeout(() => {
          this.countDown !== 1
            ? (this.countDown -= 1)
            : (this.countDown = "Go !");
          this.countDownTimer();
        }, 1000);
      } else {
        if (this.$route.path === "/lobby") this.$router.push("/round");
      }
    },
  },
  watch: {
    // Check if player has been kicked
    players(val, oldValue) {
      if (val.length >= 0) {
        if (val.length < oldValue.length) {
          this.$store.dispatch("playAudio", this.audioDisconnect);
        } else if (val.length > oldValue.length) {
          this.$store.dispatch("playAudio", this.audioConnect);
        }
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
  async beforeRouteLeave(to, from, next) {
    this.audioStart.muted = true;
    if (this.countDownTimeout) {
      clearTimeout(this.countDownTimeout);
    }
    next();
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
  text-align: center;
  animation: count 0.1s cubic-bezier(0.1, 0.1, 1, 1) 1;
}
</style>
