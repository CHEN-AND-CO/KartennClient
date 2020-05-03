<template>
    <v-autocomplete
        dense
        solo
        flat
        background-color="primary"
        hide-details
        label="Rechercher une commune"
        :items="townships"
        item-text="name"
        item-value="insee"
        search-input="selectTownship"
        @change="selectTownship"
    >
    </v-autocomplete>
</template>

<script>
import Map from "../lib/map";

export default {
    data: () => ({
        townships: ['ret', 'mar', 'frv'],
        isLoading: true
    }),

    mounted() {
        console.log("wola");
        Map.onMapReady(() => {
            this.townships = Map.getTownships();
        });
    },

    methods: {
        selectTownship(val) {
            console.log(val)
            Map.focusFeature(Map.getFeatureByTag("ref:INSEE", val));
        }
    }
}
</script>

<style>

</style>