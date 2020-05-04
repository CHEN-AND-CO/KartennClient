<template>
  <div class="home">
    <Map></Map>
    <TownshipInfo></TownshipInfo>
  </div>
</template>

<script>
import Map from '../components/Map';
import TownshipInfo from "../components/TownshipInfo";

export default {
  name: 'Home',
  components: {
    Map,
    TownshipInfo
  }
}
</script>

<style lang="less">
.home {
  width: 100%;
  height: 100%;
}
</style>
