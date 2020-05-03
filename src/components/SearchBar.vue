<template>
    <v-autocomplete
        dense
        solo-inverted
        flat
        background-color=""
        hide-details
        label="Rechercher une commune"
        :items="townships"
        item-text="name"
        item-value="insee"
        search-input="selectTownship"
        @change="selectTownship"
    >
        <template v-slot:item="data">
            <span class="township">
                {{data.item.name || 'n/a'}}
                <span class="township-meta">
                    <pre>INSEE: {{data.item.insee || 'n/a'}}</pre>
                    <pre>Code postal: {{data.item.postcode || 'n/a'}}</pre>
                </span>
            </span>
        </template>
    </v-autocomplete>
</template>

<script>
import Map from "../lib/map";

export default {
    data: () => ({
        townships: [],
        isLoading: true
    }),

    mounted() {
        console.log("wola");
        Map.onMapReady(() => {
            this.townships = Map.getTownships();
        });
    },

    updated() {
        let townships = Map.getTownships();
        if (this.townships.length < townships.length) this.townships = townships;
    },

    methods: {
        selectTownship(val) {
            console.log(val)
            Map.focusFeature(Map.getFeatureByTag("ref:INSEE", val));
        }
    }
}
</script>

<style lang="less">
    .township {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        color: var(--v-secondaryText-lighten1);

        .township-meta  pre {
            display: inline-block;
            padding: .05em .5em;
            margin-left: .4em;
    
            color: var(--v-secondaryText-lighten2);
            background-color: var(--v-secondary-base);
            border-radius: 0.2em;
            font-size: 0.7em;
        }
    }
</style>