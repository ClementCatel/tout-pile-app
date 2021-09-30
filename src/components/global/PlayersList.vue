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
        <v-avatar size="60" color="transparent">
          <img :src="player.avatarURL" />
          <!-- <v-icon dark> mdi-account-circle </v-icon> -->
        </v-avatar>
        <v-card-title>
          {{ player.username }}
        </v-card-title>
        <v-spacer></v-spacer>

        <v-chip
          v-if="answers"
          color="white"
          class="px-6 mr-2 font-weight-bold"
          large
          >{{ playerAnswer(player.id) }}</v-chip
        >

        <div v-else>
          <span v-if="isPlayerLeader(player.id)" class="text-h5 mr-2">👑</span>
          <v-btn
            v-else-if="isLeader"
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
        return this.answers[playerId]?.answer || "";
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
.playerCard {
  background-color: rgb(0, 0, 0, 0.34) !important;
}
.whiteBorder {
  border: solid 2px #00e676;
}
</style>
