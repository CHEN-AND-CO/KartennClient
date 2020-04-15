<template>
  <v-app id="app">
    <v-app-bar id="app-header" app color="primary" dark>
      <router-link to="/" class="d-flex align-center">
        <v-icon
          class="shrink mr-2"
          contain
          transition="scale-transition"
          width="40"
          >mdi-map</v-icon
        >
        <span id="headerLogo">
          Kartenn
        </span>
      </router-link>

      <v-spacer></v-spacer>
      <v-btn text>
        <v-icon>mdi-invert-colors</v-icon>
      </v-btn>
      <router-link to="/login">
        <span class="mr-2">Connexion</span>
        <v-icon>mdi-login</v-icon>
      </router-link>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({})
};
</script>

<style lang="less">
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;

  #app-header {
    #headerLogo {
      font-size: 2em;
      font-style: normal;
      font-family: "Lobster", cursive, sans-serif;
    }
  }
}
</style>
