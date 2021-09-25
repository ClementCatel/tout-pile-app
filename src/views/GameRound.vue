<template>
  <v-container class="white--text">
    <v-row justify="center">
      <v-col cols="10" class="pl-0">
        <h1 class="px-10 mb-5">1/10</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="6" class="mr-3">
        <h2 class="centerQst">
          {{ question }}
        </h2>
      </v-col>
    </v-row>
    <v-row justify="center mt-12 mb-5">
      <h3>{{ timer }}</h3>
    </v-row>
    <v-row justify="center mb-12">
      <v-img
        lazy-src="loading"
        max-height="300"
        max-width="533"
        :src="src"
      ></v-img>
    </v-row>
    <v-row justify="center">
      <v-col cols="4">
        <v-text-field
          :label="$t('round.response')"
          value=""
          :suffix="respType"
          solo
        ></v-text-field>
      </v-col>
      <v-col cols="auto" class="pl-0">
        <v-btn
          height="48px"
          :loading="loading"
          :disabled="loading"
          color="success"
          @click="loader = 'loading'"
        >
          {{ $t("round.validate") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      question: "Ceci est-il un exemple de question ?",
      timer: "15s",
      src: "https://picsum.photos/id/11/500/300",
      respType: "Date",
      loading: false,
    };
  },
};
</script>
<style scoped>
.centerQst {
  text-align: center;
}
</style>
