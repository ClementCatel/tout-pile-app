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
          rounded="xl"
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
          rounded="xl"
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
      roundsItems: [15, 20, 25],
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
    };
  },
  computed: {
    ...mapState("game", ["game"]),
    players() {
      return this.game?.players || [];
    },
    isLeader() {
      return true;
    },
  },
  methods: {
    kickPlayer(playerId) {
      console.log("kick : ", playerId);
    },
    startGame() {
      console.log("Start game");
    },
    copyLink() {
      console.log("Copy Link");
    },
    leaveGame() {
      console.log("Leave game");
      this.$router.push("/");
    },
  },
  created() {
    console.log();
  },
};
</script>
<style scoped>
.card {
  background-color: #4a3c82;
}
</style>
