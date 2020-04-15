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

      <v-btn text fab>
        <v-icon>mdi-invert-colors</v-icon>
      </v-btn>

      <v-btn id="login-btn" to="/login" text>
        <span class="mr-2">Connexion</span>
        <v-icon>mdi-login</v-icon>
      </v-btn>

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

  #login-btn {
    // text-transform: none;
  }
}
</style>
