<template>
  <section>
    <div
      class="background"
      :style="{ 'background-image': `url(${backgroundImg})` }"
    ></div>
  </section>
</template>

<script>
//import LandingRank from '../components/landing_rank.vue'

export default {
  name: "Landing",
  components: {
    //LandingRank
  },
  data() {
    return {
      backgroundImg: "https://api.daihan.top/api/acg",
    };
  },
};
</script>

<style lang="scss">
.background {
  position: relative;
  height: calc(100vh + 6rem);

  background: {
    attachment: scroll;
    repeat: no-repeat;
    position: 50%;
    size: cover;
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 0;

    background: {
      attachment: fixed;
      image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAADAQMAAACDJEzCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAGUExURQAAAEdwTIDnVscAAAACdFJOUzMAgvioCAAAAA5JREFUCNdjOMBwgIEBAAYGAYE538a8AAAAAElFTkSuQmCC);
    }
  }
}
</style>
