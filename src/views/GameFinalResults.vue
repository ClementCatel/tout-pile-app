<template>
  <v-container class="containerHeight">
    <v-row class="rowHeight white--text" align="end" justify="center">
      <v-col cols="2" class="text-center">
        <v-avatar size="90" color="transparent">
          <img
            src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
          />
        </v-avatar>
        <h4 class="second">
          {{ username }}
        </h4>
        <v-card
          rounded="lg"
          elevation="10"
          outlined
          class="card white--text"
          height="180"
        >
          <v-card-title class="justify-center">
            {{ points }}
          </v-card-title>
          <div class="text-center text-h3">🥈</div>
        </v-card>
      </v-col>
      <v-col cols="2" class="text-center">
        <v-avatar size="90" color="transparent">
          <img
            src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
          />
        </v-avatar>
        <h4 class="first">
          {{ username }}
        </h4>
        <v-card
          rounded="lg"
          elevation="10"
          outlined
          class="card white--text"
          height="280"
        >
          <v-card-title class="justify-center">
            {{ points }}
          </v-card-title>
          <div class="text-center text-h3">🥇</div>
        </v-card>
      </v-col>
      <v-col cols="2" class="text-center">
        <v-avatar size="90" color="transparent">
          <img
            src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
          />
        </v-avatar>
        <h4 class="third">
          {{ username }}
        </h4>
        <v-card
          rounded="lg"
          elevation="10"
          outlined
          class="card white--text"
          height="130"
        >
          <v-card-title class="justify-center">
            {{ points }}
          </v-card-title>
          <div class="text-center text-h3">🥉</div>
        </v-card>
      </v-col>
    </v-row>
    <v-row align="end" justify="center" class="scndRowHeight">
      <v-btn large class="font-weight-bold secondary--text">{{
        $t("results.back_to_lobby")
      }}</v-btn>
    </v-row>
    <pre>{{ getFirstPlayersIndexes.slice(0, 3) }}</pre>
  </v-container>
</template>
<script>
import {mapState} from "vuex";

export default {
  data() {
    return {
      points: "8pts",
      username: "Edouard",
    };
  },
  computed: {
    ...mapState("game", ["game"]),
    players() {
      return this.game?.players || [];
    },
    scoresDictionnary() {
      return this.game?.scores.reduce((obj, item) => {
        obj[item["playerId"]]
          ? (obj[item["playerId"]] = {
              playerId: item.playerId,
              totalScore: obj[item["playerId"]].totalScore + item.score,
            })
          : (obj[item["playerId"]] = {
              playerId: item.playerId,
              totalScore: item.score,
            });
        return obj;
      }, {});
    },
    getFirstPlayersIndexes() {
      const array = Object.values(this.scoresDictionnary);
      return array.sort((a, b) =>
        a.totalScore < b.totalScore ? 1 : a.totalScore > b.totalScore ? -1 : 0,
      );
    },
  },
};
</script>
<style scoped>
.card {
  background-color: #4a3c82;
}
.containerHeight {
  height: 55%;
}
.rowHeight {
  height: 100%;
}
.scndRowHeight {
  height: 40%;
}
.first {
  color: gold;
}
.second {
  color: silver;
}
.third {
  color: #a07155;
}
</style>
