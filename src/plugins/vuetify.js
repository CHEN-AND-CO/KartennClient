import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: "#70BA68",
        primaryText: "#fefefe",
        secondary: "#e0e0e0",
        secondaryText: "#424242",
        accent: "#8c9eff",
        error: "#b71c1c"
      },
      dark: {
        primary: "#519949",
        primaryText: "#fefefe",
        secondary: "#424242",
        secondaryText: "#eeeeee",
        accent: "#8c9eff",
        error: "#b71c1c"
      }
    }
  }
});
