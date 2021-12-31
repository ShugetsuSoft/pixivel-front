<template>
  <section>
    <div
      class="background"
      :style="{ 'background-image': `url(${backgroundImg})` }"
    ></div>
    <div class="info-dashboard"></div>
    <div class="container">
      <WaterFall :illusts="sampleIllusts" :identifier="loadid"/>
      <infinite-loading @infinite="sampleIllustsPageNext" spinner="spiral" :identifier="loadid" ref="infload">
        <div slot="no-more">加载完毕</div>
        <div slot="no-results">没结果</div>
        <div slot="error" slot-scope="{ trigger }">
          <div class="notification is-danger">
            <div class="buttons">
              <b-button type="is-primary" inverted @click="trigger">重试</b-button>
            </div>
          </div>
        </div>
      </infinite-loading>
    </div>
  </section>
</template>

<script>
import CONFIG from '@/config.json'
import WaterFall from '@/components/waterfall'
//import LandingRank from '../components/landing_rank.vue'

export default {
  name: "Landing",
  components: {
    WaterFall
    //LandingRank
  },
  data() {
    return {
      backgroundImg: "https://api.daihan.top/api/acg",
      sampleIllusts: [],
      loadid: +new Date(),
    };
  },
  methods: {
    sampleIllustsPageNext($state) {
      let params = {
        "t": +new Date()
      }
      this.axios
        .get(CONFIG.API_HOST + `illusts/sample`, {
          params
        }).then((response) => {
        if (response.data.error) {
          this.error(response.data.message)
          $state.error()
          return;
        }
        this.sampleIllusts = this.sampleIllusts.concat(response.data.data.illusts)
        $state.loaded()
      }).catch((error)=>{
        this.error(error.response.data.message)
        $state.error()
      })
    },
    error(message) {
      this.$buefy.notification.open({
        duration: 5000,
        message: message,
        type: 'is-danger',
      })
    }
  }
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

.info-dashboard {
  
}
</style>
