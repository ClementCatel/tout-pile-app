<template>
  <div>
    <v-card
      v-for="(player, index) in players"
      :key="index"
      class="pa-2 mb-4 playerCard white--text"
      rounded="pill"
    >
      <div class="d-flex align-center">
        <v-avatar size="60" color="grey">
          <img :src="player.avatarURL" />
          <!-- <v-icon dark> mdi-account-circle </v-icon> -->
        </v-avatar>
        <v-card-title>
          {{ player.username }}
        </v-card-title>
        <v-spacer></v-spacer>

        <span v-if="player.isLeader" class="text-h5 mr-2">👑</span>
        <v-btn
          v-else-if="isLeader"
          color="primary"
          x-small
          fab
          dark
          class="mr-2"
          @click="kickPlayer(player.id)"
          ><v-icon> mdi-close </v-icon></v-btn
        >
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
    },
  },
  computed: {
    isLeader() {
      return true;
    },
  },
  methods: {
    kickPlayer(playerId) {
      this.$emit("kick", playerId);
    },
  },
};
</script>

<style scoped>
.playerCard {
  background-color: rgb(0, 0, 0, 0.34) !important;
}
</style>
