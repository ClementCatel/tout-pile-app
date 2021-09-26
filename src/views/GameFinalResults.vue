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
          <v-card-text class="text-center text-h3"> 🥈 </v-card-text>
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
          <v-card-text class="text-center text-h3"> 🥇 </v-card-text>
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
          <v-card-text class="text-center text-h3"> 🥉 </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row align="end" justify="center" class="scndRowHeight">
      <v-btn large class="font-weight-bold secondary--text">{{
        $t("results.back_to_lobby")
      }}</v-btn>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      points: "8pts",
      username: "Edouard",
    };
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
