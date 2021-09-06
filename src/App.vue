<template>
  <v-app>
    <v-main class="primary">
      <v-row justify="center" class="mt-15">
        <v-col cols="auto"> <h1 class="white--text">Tout Pile</h1> </v-col>
      </v-row>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>
