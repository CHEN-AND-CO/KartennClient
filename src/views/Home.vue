<template>
  <div class="home">
    <Map></Map>
  </div>
</template>

<script>
import Map from '../components/Map';

export default {
  name: 'Home',
  components: {
    Map
  }
}
</script>

<style lang="less">
.home {
  width: 100%;
  height: 100%;
}
</style>
