<template>
  <v-container>
    <v-row justify="center" class="my-12">
      <v-col cols="auto text-center">
        <h2 v-if="isInvited" class="white--text mb-3">
          {{ $t("onboarding.has_been_invited") }}
        </h2>
        <v-avatar size="200" color="transparent">
          <img :src="avatarURL" />
        </v-avatar>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="auto">
        <v-text-field
          :label="$t('onboarding.username')"
          v-model="username"
          solo
          :maxlength="max"
          :minlength="min"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-alert v-model="alert" type="error" dismissible>
        {{ alertMessage }}
      </v-alert>
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
          @click="start"
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
      alert: false,
      alertMessage: null,
      // player data
      username: "",
      max: 15,
      min: 1,
    };
  },
  computed: {
    isInvited() {
      return !!this.$route.query.game;
    },
    // localPlayer() {
    //   return this.$store.state.player.player;
    // },
    storeUsername() {
      return this.$store.state.player.player?.username;
    },
    avatarURL() {
      return `https://api.dicebear.com/9.x/bottts/svg?seed=${this.username}`;
    },
  },
  methods: {
    async start() {
      try {
        this.loading = true;
        if (this.validateUsername()) {
          await this.$store.dispatch("player/signInAnonymously", {
            username: this.username,
            avatarURL: this.avatarURL,
          });
          // if (!this.localPlayer) {
          //   await this.$store.dispatch("player/createPlayer", {
          //     username: this.username,
          //     avatarURL: this.avatarURL,
          //   });
          // } else {
          //   await this.$store.dispatch("player/editPlayer", {
          //     username: this.username,
          //     avatarURL: this.avatarURL,
          //   });
          // }
          await this.$store.dispatch("game/createGame");
          this.$router.push("/lobby");
        } else {
          this.loading = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async joinGame() {
      try {
        this.loading = true;
        if (this.validateUsername()) {
          await this.$store.dispatch("player/signInAnonymously", {
            username: this.username,
            avatarURL: this.avatarURL,
          });
          // if (!this.localPlayer) {
          //   await this.$store.dispatch("player/createPlayer", {
          //     username: this.username,
          //     avatarURL: this.avatarURL,
          //   });
          // } else {
          //   await this.$store.dispatch("player/editPlayer", {
          //     username: this.username,
          //     avatarURL: this.avatarURL,
          //   });
          // }
          await this.$store.dispatch("game/addPlayer", this.$route.query.game);
          await this.$store.dispatch("game/getGame", this.$route.query.game);
          await this.$store.dispatch("game/bindGame", this.$route.query.game);
          this.$router.push("/lobby");
        } else {
          this.loading = false;
        }
      } catch (error) {
        console.error(error);
        this.loading = false;
        this.alertMessage = error.message;
        this.alert = true;
      }
    },
    validateUsername() {
      return (
        this.username.length <= this.max && this.username.length >= this.min
      );
    },
  },
  watch: {
    storeUsername(val) {
      if (val) {
        this.username = val;
      }
    },
  },
  async created() {
    // const playerId = localStorage.playerId;
    // if (playerId) {
    //   await this.$store.dispatch("player/getPlayer", playerId);
    //   this.username = this.$store.state.player.player.username;
    // }
    this.username = this.$store.state.player.player?.username || "";
  },
};
</script>
