<template>
  <v-container class="containerHeight">
    <v-row class="rowHeight white--text" align="end" justify="center">
      <v-col cols="2" class="text-center" v-if="getFirstPlayersIndexes[1]">
        <v-avatar size="90" color="transparent">
          <img
            :src="getPlayerById(getFirstPlayersIndexes[1].playerId).avatarURL"
          />
        </v-avatar>
        <h4 class="second">
          {{ getPlayerById(getFirstPlayersIndexes[1].playerId).username }}
        </h4>
        <v-card
          rounded="lg"
          elevation="10"
          outlined
          class="card white--text"
          height="180"
        >
          <v-card-title class="justify-center">
            {{ getFirstPlayersIndexes[1].totalScore }} pts
          </v-card-title>
          <div class="text-center text-h3">🥈</div>
        </v-card>
      </v-col>
      <v-col cols="2" class="text-center" v-if="getFirstPlayersIndexes[0]">
        <v-avatar size="90" color="transparent">
          <img
            :src="getPlayerById(getFirstPlayersIndexes[0].playerId).avatarURL"
          />
        </v-avatar>
        <h4 class="first">
          {{ getPlayerById(getFirstPlayersIndexes[0].playerId).username }}
        </h4>
        <v-card
          rounded="lg"
          elevation="10"
          outlined
          class="card white--text"
          height="280"
        >
          <v-card-title class="justify-center">
            {{ getFirstPlayersIndexes[0].totalScore }} pts
          </v-card-title>
          <div class="text-center text-h3">🥇</div>
        </v-card>
      </v-col>
      <v-col cols="2" class="text-center" v-if="getFirstPlayersIndexes[2]">
        <v-avatar size="90" color="transparent">
          <img
            :src="getPlayerById(getFirstPlayersIndexes[2].playerId).avatarURL"
          />
        </v-avatar>
        <h4 class="third">
          {{ getPlayerById(getFirstPlayersIndexes[2].playerId).username }}
        </h4>
        <v-card
          rounded="lg"
          elevation="10"
          outlined
          class="card white--text"
          height="130"
        >
          <v-card-title class="justify-center">
            {{ getFirstPlayersIndexes[2].totalScore }} pts
          </v-card-title>
          <div class="text-center text-h3">🥉</div>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="isLeader" align="end" justify="center" class="scndRowHeight">
      <v-btn
        large
        class="font-weight-bold secondary--text"
        @click="backToLobby"
        >{{ $t("results.back_to_lobby") }}</v-btn
      >
    </v-row>
  </v-container>
</template>
<script>
import {mapState} from "vuex";

export default {
  name: "GameFinalResults",
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
      return array
        .sort((a, b) =>
          a.totalScore < b.totalScore
            ? 1
            : a.totalScore > b.totalScore
            ? -1
            : 0,
        )
        .slice(0, 3);
    },

    getStartedValue() {
      return this.game?.started;
    },
    isLeader() {
      return (
        this.$store.state.player.player.id ===
        this.$store.state.game.game.leaderId
      );
    },
  },
  methods: {
    getPlayerById(playerId) {
      return this.players.find((player) => {
        return player.id === playerId;
      });
    },
    async backToLobby() {
      await this.$store.dispatch("game/resetGame");
      this.$router.push("/lobby");
    },
  },
  watch: {
    getStartedValue(value) {
      if (!value) {
        this.$router.push("/lobby");
      }
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
