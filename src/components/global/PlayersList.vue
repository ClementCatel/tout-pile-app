<template>
  <div>
    <v-card
      v-for="(player, index) in players"
      :key="index"
      :class="[
        isPlayer(player.id) ? 'whiteBorder' : '',
        'pa-2 mb-4 playerCard white--text',
      ]"
      rounded="pill"
    >
      <div class="d-flex align-center">
        <v-avatar size="40" color="transparent">
          <img :src="player.avatarURL" />
        </v-avatar>
        <v-card-title class="py-0 text-ellipsis-item">
          <div class="text-ellipsis">{{ player.username }}</div>
        </v-card-title>
        <v-spacer></v-spacer>

        <v-chip v-if="answers" color="white" class="px-6 font-weight-bold">{{
          playerAnswer(player.id)
        }}</v-chip>

        <div v-if="scores && showPoints" class="ml-3 fit-content">
          <span
            :class="[
              index === 0
                ? 'gold'
                : index === 1
                ? 'silver'
                : index === 2
                ? 'bronze'
                : '',
              'px-2 mr-1 font-weight-bold',
            ]"
            >{{ playerScore(player.id) }} {{ $t("players.points") }}</span
          >
        </div>

        <div v-else>
          <div
            v-if="isPlayerLeader(player.id) && !answers"
            class="text-h5 mr-2 d-flex align-center"
          >
            <img height="30px" src="@/assets/icons/crownIcon.svg" />
          </div>
          <v-btn
            v-else-if="isLeader && !answers"
            color="primary"
            x-small
            fab
            dark
            class="mr-2"
            @click="kickPlayer(player)"
            ><v-icon> mdi-close </v-icon></v-btn
          >
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "PlayersList",
  props: {
    players: {
      type: Array,
      default: () => {
        return [];
      },
    },
    answers: {
      type: [Object, Boolean],
      default: false,
    },
    scores: {
      type: [Object, Boolean],
      default: false,
    },
    showPoints: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isLeader() {
      return (
        this.$store.state.player.player.id ===
        this.$store.state.game.game.leaderId
      );
    },
  },
  methods: {
    isPlayer(playerId) {
      return playerId === this.$store.state.player.player.id;
    },
    isPlayerLeader(playerId) {
      return playerId === this.$store.state.game.game.leaderId;
    },
    playerAnswer(playerId) {
      if (this.answers) {
        const value = this.answers[playerId]?.answer || 0;
        return parseFloat(value).toLocaleString();
      }
      return null;
    },
    playerScore(playerId) {
      if (this.scores) {
        return this.scores[playerId] || 0;
      }
      return null;
    },
    kickPlayer(player) {
      this.$emit("kick", player);
    },
  },
};
</script>

<style scoped>
.text-ellipsis-item {
  display: flex;
  min-width: 0;
}
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fit-content {
  min-width: fit-content;
}
.playerCard {
  background-color: rgb(0, 0, 0, 0.34) !important;
}
.whiteBorder {
  border: solid 2px #00e676;
}
.gold {
  color: gold;
}
.silver {
  color: silver;
}
.bronze {
  color: #a07155;
}
</style>
