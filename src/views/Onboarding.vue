<template>
  <v-container>
    <v-row justify="center" class="my-15">
      <v-col cols="auto"
        ><v-avatar size="150">
          <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="avatar" />
        </v-avatar>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="auto">
        <v-text-field :label="$t('onboarding.username')" solo></v-text-field
      ></v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="auto">
        <v-btn elevation="2" class="px-10 font-weight-bold">{{
          $t("onboarding.start")
        }}</v-btn></v-col
      >
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
};
</script>
