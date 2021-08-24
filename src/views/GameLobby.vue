<template>
  <v-container>
    <v-row style="margin-left: 26%">
      <v-btn
        elevation="2"
        class="px-10 font-weight-bold primary--text mb-10"
        outlined
        >{{ $t("gameLobby.return") }}</v-btn
      >
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <v-row>
          <v-card
            elevation="24"
            outlined
            height="500"
            width="350"
            class="ml-16 card"
          ></v-card>
        </v-row>
      </v-col>
      <v-col cols="auto">
        <v-row>
          <v-card
            elevation="24"
            outlined
            height="300"
            width="500"
            class="ml-16 card"
          ></v-card>
        </v-row>

        <v-row justify="center" class="mt-16">
          <v-btn
            elevation="2"
            class="px-10 font-weight-bold ml-16 primary secondary--text"
            >{{ $t("gameLobby.copyLink") }}</v-btn
          >
          <v-btn
            elevation="2"
            class="px-10 font-weight-bold ml-16 primary secondary--text"
            >{{ $t("gameLobby.startGame") }}</v-btn
          >
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
};
</script>
<style scoped>
.card {
  border-radius: 20px !important;
  background-color: #4c37a4 !important;
}
</style>
