<template>
  <section>
    <b-navbar class="landing-navbar">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img src="../assets/images/favicon.png" />
        </b-navbar-item>
        <div class="title-container">
          <h3 class="title is-3"> Pixivel </h3>
        </div>
      </template>
      <template #end>
        <b-navbar-item tag="div">
          <b-autocomplete
            rounded
            v-model="searchKeyword"
            :data="searchSuggestList"
            placeholder="试着输入些内容吧.."
            icon="uil-search"
            icon-pack="uil"
            @typing="suggestdebu"
            @keyup.enter.native="search()"
            @select="search"
            open-on-focus>
            <template #empty>No results found</template>
          </b-autocomplete>
        </b-navbar-item>
      </template>
    </b-navbar>
    <div class="full-screen">
      <div
        class="background"
        :style="{ 'background-image': `url(${backgroundImg})` }"
      ></div>
      <img class="logo" src="../assets/images/logo.svg" />
    </div>
    <div class="container landing-info">
      <div class="columns">
        <div class="column is-two-thirds">
          <div class="notification">
            <h2>排行榜</h2>
            <HScroll :illusts="rankIllusts" @load="loadRankIllusts" :has-load="rankIllustsContinue" ref="userIllusts"></HScroll>
          </div>
        </div>
        <div class="column">
          <div class="notification">
            <h2>推荐画师</h2>
            <UserList :users='sampleUsers' :has-load="true" @load="loadSampleUsers"></UserList>
          </div>
        </div>
      </div>
    </div>
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
import HScroll from '@/components/horizontal_scroll'
import UserList from '@/components/user_list'

export default {
  name: "Landing",
  components: {
    WaterFall,
    HScroll,
    UserList
  },
  data() {
    return {
      backgroundImg: "https://api.daihan.top/api/acg",
      sampleIllusts: [],
      sampleIllustsPage: 0,
      loadid: +new Date(),
      rankIllustsContinue: true,
      rankIllusts: [],
      rankIllustsPage: 0,
      searchKeyword: "",
      suggestdebu: null,
      searchSuggestList: [],
      sampleUsers: [],
      sampleUsersPage: 0,
    };
  },
  created() {
    if (!this.$store.getters['Settings/get']('global.viewed')) {
      this.$store.commit('Settings/set', {key:'global.viewed',value:true})
      this.$router.push({'name': 'Welcome'})
    }
    this.suggestdebu = this.Lodash.debounce(() => {
      if (this.searchKeyword != "") {
        this.axios
          .get(CONFIG.API_HOST + `illust/search/${this.searchKeyword}/suggest`)
          .then((response) => {
            if (response.data.error) {
              this.error(response.data.message)
              return;
            }
            this.searchSuggestList = response.data.data.suggest_words
          }).catch((error)=>{
          this.error(error.message)
        })
      }
    },800)
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    sampleIllustsPageNext($state) {
      let params = {
        "p": this.sampleIllustsPage
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
        let sanity = this.$store.getters["Settings/get"]("sample.sanity_filter")
        this.sampleIllusts = this.sampleIllusts.concat(response.data.data.illusts.filter((item) => {
          return item.sanity < sanity
        }))
        $state.loaded()
        this.sampleIllustsPage += 1
      }).catch((error)=>{
        this.error(error.message)
        $state.error()
      })
    },
    loadSampleUsers() {
      let params = {
        "p": this.sampleUsersPage,
      }
      this.axios
        .get(CONFIG.API_HOST + `user/sample`, {
          params
        }).then((response) => {
        if (response.data.error) {
          this.error(response.data.message)
          return;
        }
        this.sampleUsers = this.sampleUsers.concat(response.data.data.users)
        this.sampleUsersPage += 1
      }).catch((error)=>{
        this.error(error.message)
      })
    },
    search(keywd) {
      let key = ""
      if (this.searchKeyword != "") {
        key = this.searchKeyword
      } else if(keywd){
        key = keywd
      }
      if (key != "") {
        if (/^[\d]+$/.test(key)) {
          this.$buefy.dialog.confirm({
            title: '跳转ID',
            message: '检测到数字的输入，将会跳转到对应的插画或画师界面，请选择',
            confirmText: '去插画界面',
            cancelText: '去画师界面',
            onCancel: () => {
              this.$router.push({ name: 'User', params: { id: key }})
            },
            onConfirm: () => {
              this.$router.push({ name: 'Detail', params: { id: key }})
            }
          })
          return
        }
        this.$router.push({ name: 'Search', query: { keyword: key, mode: "illust" }})
      }
      
    },
    loadRankIllusts() {
      let params = {
        "mode": "daily",
        "content": "all",
        "date": this.moment().subtract(2, 'days').format('YYYYMMDD'),
        "page": this.rankIllustsPage,
      }
      this.axios
        .get(CONFIG.API_HOST + `rank/`,{
          params,
        }).then((response) => {
        if (response.data.error) {
          this.error(response.data.message)
          return;
        }
        if (!response.data.data.has_next) {
          this.rankIllustsContinue = false
        }
        this.rankIllusts = this.rankIllusts.concat(response.data.data.illusts)
        this.rankIllustsPage += 1
      }).catch((error)=>{
        this.error(error.message)
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
.full-screen {
  .logo {
    position: absolute;
    margin-bottom: -19rem;
    bottom: 25%;
    left: 0;
    right: 0;
    z-index: 10;
    width: 100%;
    height: 38rem;
    object-position: center;
    @media screen and (max-width: 975px) {
      object-fit: contain;
    }
    object-fit: cover;
    filter: brightness(1.03);
    opacity: 0;
    animation: toshow .5s ease-out forwards;
  }

  @keyframes toshow {
    to {
      opacity: 1;
    }
  }

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
}

.landing-info {
  padding: {
    left: 0.75rem;
    right: 0.75rem;
  }
  margin: {
    top: -2rem;
    bottom: 2rem;
  }
  .userlist {
    height: 187px;
  }
  .notification {
    padding: {
      top: 1.25rem;
      bottom: 1.25rem;
      left: 1.5rem;
      right: 1.5rem;
    }
  }
}

.landing-navbar {
  position: absolute;
  top: 0;
  width: 100%;
  height: 4rem;
  z-index: 100;
  background: transparent;
  img {
    margin-left: 7px;
  }
  input {
    box-shadow: none !important;
    border: none;
    background: rgba(255, 255, 255, 0.3) !important;
    min-width: 20rem;
    color: #2f2f2f;
  }
  .title-container {
    display: flex;
    align-items: center;
    .title {
      color: #ffffff;
    }
  }
  .icon {
    color: #4a4a4a !important;
  }
}
</style>
