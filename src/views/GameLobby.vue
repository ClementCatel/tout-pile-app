<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-btn
          elevation="2"
          class="px-10 font-weight-bold white--text mb-10"
          outlined
          large
          >{{ $t("lobby.return") }}</v-btn
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
          <players-list :players="players" />
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
          <div class="mx-6">
            <v-row>
              <div class="col-3 text-h5">
                {{ $t("lobby.timer") }}
              </div>
              <v-col>
                <v-select
                  v-model="timerSelected"
                  :items="timerItems"
                  label="Durée"
                  solo
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <div class="col-3 text-h5">
                {{ $t("lobby.rounds") }}
              </div>
              <v-col>
                <v-select
                  v-model="roundsSelected"
                  :items="roundsItems"
                  label="Tours"
                  solo
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <div class="col-3 text-h5">
                {{ $t("lobby.categories") }}
              </div>
              <v-col>
                <v-autocomplete
                  chips
                  multiple
                  label="Catégories"
                  solo
                  clearable
                  :items="categoriesItems"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </div>
        </v-card>

        <div class="d-flex justify-center mt-16">
          <v-btn
            elevation="2"
            large
            class="mr-3 font-weight-bold secondary--text"
            >{{ $t("lobby.copyLink") }}</v-btn
          >
          <v-btn
            elevation="2"
            large
            class="ml-3 font-weight-bold secondary--text"
            >{{ $t("lobby.startGame") }}</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PlayersList from "@/components/global/PlayersList";

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
    };
  },
  computed: {
    players() {
      return [
        {
          username: "bob",
          isLeader: true,
        },
        {
          username: "john",
        },
        {
          username: "peter",
        },
        {
          username: "fred",
        },
      ];
    },
  },
};
</script>
<style scoped>
.card {
  background-color: #4c37a4 !important;
}
</style>