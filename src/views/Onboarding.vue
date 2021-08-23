<template>
  <v-container>
    <v-row justify="center" class="my-15">
      <v-col cols="auto text-center">
        <h2 v-if="isInvited" class="primary--text mb-3">
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
          @click="joinGame"
          elevation="2"
          class="px-10 font-weight-bold"
          >{{ $t("onboarding.join") }}</v-btn
        >
        <v-btn
          v-else
          @click="startGame"
          elevation="2"
          class="px-10 font-weight-bold"
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
      username: "",
    };
  },
  computed: {
    isInvited() {
      return !!this.$route.query.game;
    },
  },
  methods: {
    async startGame() {
      console.log("start");
    },
    async joinGame() {
      console.log("join");
    },
  },
};
</script>
