<template>
  <v-app>
    <v-main class="background">
      <v-row justify="center" class="my-15">
        <v-col cols="auto"> <h1 class="primary--text">Tout Pile</h1> </v-col>
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
