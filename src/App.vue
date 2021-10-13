<template>
  <v-app>
    <v-main class="backColor">
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
  mounted() {
    window.onpopstate = () => {
      if (this.$route.path !== "/") {
        this.$router.push("/");
      }
    };
  },
};
</script>
<style scoped>
.backColor {
  background-image: linear-gradient(to top, #5f72bd 0%, #9b23ea 100%);
}
</style>
