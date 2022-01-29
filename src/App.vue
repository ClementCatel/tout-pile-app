<template>
  <v-app>
    <v-main class="backColor">
      <v-container>
        <v-row justify="center" class="my-4">
          <v-col cols="3" class="px-0 d-flex align-center">
            <v-btn
              v-if="isLobby"
              class="px-sm-10 font-weight-bold white--text"
              outlined
              @click="leaveGame"
              ><v-icon left>mdi-arrow-left</v-icon>
              {{ $t("lobby.return") }}</v-btn
            >
          </v-col>
          <v-col cols="4" class="d-flex align-center justify-center">
            <!-- <h1 class="white--text">Tout Pile</h1> -->
            <img :height="height" src="@/assets/logo.svg" class="grow-hover" />
          </v-col>
          <v-col
            cols="3"
            class="d-flex align-center justify-end text-right px-0"
          >
            <v-btn @click="muteSound" icon dark x-large class="mr-6"
              ><v-icon v-if="isMuted">mdi-volume-off</v-icon>
              <v-icon v-else>mdi-volume-high</v-icon>
            </v-btn>
            <v-dialog transition="dialog-top-transition" max-width="800">
              <template v-slot:activator="{on, attrs}">
                <img
                  height="50px"
                  src="@/assets/icons/rules.svg"
                  class="grow-hover"
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <template v-slot:default="dialog">
                <v-card>
                  <v-toolbar color="primary" dark
                    ><img
                      class="mr-4"
                      height="50px"
                      src="@/assets/icons/listIcon.svg"
                    />
                    <h2>{{ $t("lobby.rules_title") }}</h2></v-toolbar
                  >
                  <v-card-text>
                    <div class="mt-6">
                      <h2 class="my-12">
                        Tout pile est un Quizz en ligne de 2 à 10 joueurs.
                      </h2>
                      <ul class="rulesText">
                        <div class="d-flex align-center mb-10">
                          <img
                            class="mr-4"
                            height="50px"
                            src="@/assets/icons/timerIcon.svg"
                          />
                          <li>
                            Avant chaque partie l'hôte décide du nombre de
                            manches et du temps de réponse par question.
                          </li>
                        </div>
                        <div class="d-flex align-center mb-10">
                          <img
                            class="mr-4"
                            height="43px"
                            src="@/assets/icons/shareLinkIcon.svg"
                          />
                          <li>
                            L'hôte de la partie doit partager le lien
                            d'invitation avec ses amis afin qu'ils le rejoignent
                            pour commencer à s'amuser tous ensemble !
                          </li>
                        </div>
                        <div class="d-flex align-center mb-10">
                          <img
                            class="mr-4"
                            height="43px"
                            src="@/assets/icons/numericIcon.svg"
                          />
                          <li>
                            1 manche = 1 question ayant pour réponse une valeur
                            numérique (nombre, mètre, litre, km/h, heure ...)
                          </li>
                        </div>
                        <div class="d-flex align-center mb-10">
                          <img
                            class="mr-4"
                            height="50px"
                            src="@/assets/icons/toutPileIcon.svg"
                          />
                          <li>
                            <div class="mb-2">
                              Le joueur ayant la réponse la plus proche du
                              résultat attendu gagne un point.
                            </div>
                            <div class="mb-2">
                              S'il fait un tout pile, c'est à dire, qu'il trouve
                              la valeur exacte, il remportre 2 points.
                            </div>
                            <div class="mb-2">
                              En cas d'égalité, le joueur ayant VALIDÉ sa
                              réponse le plus rapidement remporte le point.
                            </div>
                          </li>
                        </div>
                        <div class="d-flex align-center mb-7">
                          <img
                            class="mr-4"
                            height="43px"
                            src="@/assets/icons/winIcon.svg"
                          />
                          <li>
                            Le joueur ayant le plus de points à l'issue des
                            manches remporte la partie.
                          </li>
                        </div>
                      </ul>
                    </div>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn text @click="dialog.value = false">{{
                      $t("lobby.close")
                    }}</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-col>
        </v-row>
      </v-container>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  computed: {
    isLobby() {
      return this.$route.path === "/lobby";
    },
    isMuted() {
      return this.$store.state.muted;
    },
    height() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 30;
        default:
          return 100;
      }
    },
  },
  methods: {
    async leaveGame() {
      if (this.$store.state.game.game) {
        await this.$store.dispatch(
          "game/removePlayer",
          this.$store.state.player.player,
        );
      }
    },
    muteSound() {
      if (this.$store.state.muted) {
        this.$store.commit("SET_MUTED", false);
      } else {
        this.$store.commit("SET_MUTED", true);
      }
    },
  },
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

.grow-hover {
  transition: all 0.2s ease-in-out;
}
.grow-hover:hover {
  transform: scale(1.1);
}

.rulesText {
  font-size: 18px;
}

ul {
  list-style-type: none;
}
</style>
