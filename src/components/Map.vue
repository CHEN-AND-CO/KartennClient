<template>
  <div id="map-container"></div>
</template>

<script>
import OLMap from "../lib/map";

export default {
  mounted() {
    OLMap.createMap("map-container");
  }
};
</script>

<style lang="less">
#map-container {
  width: 100%;
  height: 100%;
}

.ol-attribution:not(.ol-collapsed) {
  background-color: var(--v-secondary-base);
  opacity: 0.9;

  font-size: 0.8em;

  ul {
    padding: 0 0.2em 0 0.8em;

    li {
      text-shadow: none;
      color: var(--v-secondaryText-lighten2);
    }
  }
}

.ol-control {
  button {
    background-color: var(--v-primary-base);
  }
}
</style>