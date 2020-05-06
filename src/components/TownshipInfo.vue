<template>
  <aside class="side-menu township-info elevation-7" :class="(isSelected ? '' : 'hidden')">
    <v-btn depressed x-small class="township-close-btn" @click="closePanel">
      ESC
      <v-icon dense>mdi-close</v-icon>
    </v-btn>

    <div class="township-title">
      <span class="title-label">Commune de</span>
      <h2>{{township.name}}</h2>
      <span class="name-brezhoneg">{{ (township.tags ? township.tags['name:br'] : 'n/a') }}</span>
    </div>

    <div class="township-meta">
      <span class="postcode">
        Code postal :
        <pre>{{township.postcode || 'n/a'}}</pre>
      </span>
      <span class="insee">
        INSEE :
        <pre>{{township.insee || 'n/a'}}</pre>
      </span>
    </div>

    <v-card class="map-download-card">
      <v-img :src="links.high_res" :key="links.high_res" :eager="true" class="white--text align-end">
        <v-card-title>Carte topographique</v-card-title>
      </v-img>
      <v-card-subtitle class="pb-0">Carte détaillée de la topographie</v-card-subtitle>
      <v-card-actions>
        <v-btn @click="getLink" :loading="links.hi_res_loading">Télécharger</v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="map-download-card">
      <v-img :key="links.low_res" :src="links.low_res" :eager="true" class="white--text align-end">
        <v-card-title>Plan</v-card-title>
      </v-img>
      <v-card-subtitle class="pb-0">Plan épuré, adapté à l'affichage</v-card-subtitle>
      <v-card-actions>
        <v-btn @click="getLinkSimp">Télécharger</v-btn>
      </v-card-actions>
    </v-card>
  </aside>
</template>

<script>
import Map from "../lib/map";
import { api_url } from "../constants";
import http from "../lib/http-common";
import CitiesService from "../services/CitiesService";

export default {
  data: () => ({
    township: {},
    isSelected: false,
    links: {
      high_res: "",
      low_res: "",
      hi_res_loading: false,
      low_res_loading: false
    },
    rerenderHigh: 0,
    rerenderLow: 0
  }),

  mounted() {
    Map.onFocus(f => {
      this.township = Map.getSelectedTownship();

      if (!this.township) {
        this.township = {
          name: "n/a",
          tags: null
        };
        this.isSelected = false;
      } else {
        this.isSelected = true;

        this.links.high_res = "";
        this.links.low_res = "";
        http.get("/cities/"+this.township.insee+"?create="+"false").then(res => {
            this.links.high_res = res.data.data.file;
            this.links.low_res = res.data.data.file_simp;
          })
          .catch(error => {
            console.error("Request failed" + error);
          });
      }
    });
  },

  methods: {
    closePanel() {
      this.isSelected = false;
      Map.removeFocus();
    },

    getLink() {
      this.links.hi_res_loading = true;
      CitiesService.getCity(this.township.insee, "true")
        .then(res => {
          window.open(res.data.data.file);
          this.links.high_res = res.data.data.file;
          this.links.hi_res_loading = false;
        })
        .catch(error => {
          console.error("Request failed" + error);
        });
    },
    getLinkSimp() {
      this.links.low_res_loading = true;
      CitiesService.getCity(this.township.insee, "true")
        .then(res => {
          window.open(res.data.data.file_simp);
          this.links.low_res = res.data.data.file_simp;
          this.links.low_res_loading = false;
        })
        .catch(error => {
          console.error("Request failed" + error);
        });
    }
  }
};
</script>

<style lang="less">
aside.side-menu {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 30em;
  z-index: 999;
  overflow: auto;

  display: block;
  padding: 1em 2em;
  background-color: var(--v-secondary-base);
  opacity: 0.9;

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  transition: opacity 0.12s, transform 0.18s;

  &.hidden {
    transform: translateX(-10%);
    opacity: 0;
  }
}

.township-title {
  font-family: "Roboto", Arial, Helvetica, sans-serif;

  * {
    margin-bottom: -0.2em;
  }

  span {
    font-size: 0.9em;
    color: var(--v-secondaryText-lighten2);

    &.name-brezhoneg {
      font-size: 1.2em;
      font-style: italic;
      color: var(--v-secondaryText-base);
    }
  }
}

.township-meta {
  span {
    font-size: 0.9em;
    // font-weight: bold;
    color: var(--v-secondaryText-lighten2);

    &:not(:first-child) {
      margin-left: 1em;
    }

    pre {
      display: inline-block;
      padding: 0.05em 0.5em;
      margin-left: 0.4em;

      color: var(--v-secondaryText-lighten1);
      background-color: #aaa4;
      border-radius: 0.2em;
      font-size: 0.8em;
    }
  }
}

.map-download-card {
  margin-top: 2em;
  opacity: 1;
}

.township-close-btn {
  position: absolute;
  top: 2em;
  right: 3em;
}
</style>