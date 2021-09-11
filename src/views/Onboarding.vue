<template>
  <v-container>
    <v-row justify="center" class="my-15">
      <v-col cols="auto text-center">
        <h2 v-if="isInvited" class="white--text mb-3">
          {{ $t("onboarding.has_been_invited") }}
        </h2>
        <v-icon size="200">mdi-account-circle</v-icon>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="auto">
        <v-text-field
          :label="$t('onboarding.username')"
          v-model="username"
          solo
        ></v-text-field
      ></v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="auto">
        <v-btn
          v-if="isInvited"
          elevation="2"
          class="px-10 font-weight-bold"
          :loading="loading"
          @click="joinGame"
          >{{ $t("onboarding.join") }}</v-btn
        >
        <v-btn
          v-else
          large
          elevation="2"
          class="px-10 font-weight-bold"
          :loading="loading"
          @click="createGame"
          >{{ $t("onboarding.start") }}</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Onboarding",
  data() {
    return {
      // general data
      loading: false,
      // player data
      username: "",
    };
  },
  computed: {
    isInvited() {
      return !!this.$route.query.game;
    },
    localPlayer() {
      return this.$store.state.player.player;
    },
  },
  methods: {
    async createGame() {
      try {
        this.loading = true;
        if (!this.localPlayer) {
          await this.$store.dispatch("player/createPlayer", {
            username: this.username,
          });
        } else {
          await this.$store.dispatch("player/editPlayer", {
            username: this.username,
          });
        }
        await this.$store.dispatch("game/createGame");
        this.$router.push("/lobby");
      } catch (error) {
        console.log(error);
      }
    },
    async joinGame() {
      try {
        this.loading = true;
        await this.$store.dispatch("player/createPlayer", {
          username: this.username,
        });
        await this.$store.dispatch("game/addPlayer", this.$route.query.game);
        await this.$store.dispatch("game/bindGame", this.$route.query.game);
        this.$router.push("/lobby");
      } catch (error) {
        console.log(error);
      }
    },
  },
  async created() {
    const playerId = localStorage.playerId;
    if (playerId) {
      await this.$store.dispatch("player/getPlayer", playerId);
      this.username = this.$store.state.player.player.username;
    }
  },
};
</script>
