<template>
  <section class="default-full-screen-top">
    <div class="container search-form">
      <b-field>
        <p class="control">
          <b-dropdown v-model="mode">
            <template #trigger>
              <b-button
                :label="{'illust':'插画', 'tag': '标签', 'user': '作者'}[mode]"
                type="is-success"
                icon-right="uil uil-angle-down" />
            </template>
            <b-dropdown-item value="illust">
              关键字搜索插画
            </b-dropdown-item>
            <b-dropdown-item value="tag">
              标签搜索插画
            </b-dropdown-item>
            <b-dropdown-item value="user">
              搜索作者
            </b-dropdown-item>
          </b-dropdown>
        </p>
        <b-autocomplete
          v-model="keyword"
          :data="suggestList"
          placeholder="试着输入些内容吧.."
          @select="searchonselect"
          icon="uil-search"
          icon-pack="uil"
          @typing="suggestdebu"
          @keyup.enter.native="search()"
          open-on-focus>
          <template #empty>No results found</template>
        </b-autocomplete>
        <p class="control">
          <b-button class="button is-info" @click="search()">搜索</b-button>
        </p>
      </b-field>
      <b-field v-if="mode=='illust'||mode=='tag'">
        <b-checkbox-button v-model="queryFeatures" native-value="sortpop" type="is-danger" size="is-small">
          <b-icon pack="uil" icon="uil-sort-amount-down" size="is-small"></b-icon>
          <span>热门度排序</span>
        </b-checkbox-button>
        <b-checkbox-button v-model="queryFeatures" native-value="sortdate" type="is-success" size="is-small">
          <b-icon pack="uil" icon="uil-clock" size="is-small"></b-icon>
          <span>时间排序</span>
        </b-checkbox-button>
      </b-field>
    </div>
    <section v-if="finalKeyword">
      <div class="container">
        <WaterFall :illusts="illusts" />
        <infinite-loading @infinite="illustsPageNext" spinner="spiral" :identifier="loadid" ref="infload">
          <div slot="no-more">加载完毕</div>
          <div slot="no-results">没结果</div>
          <div slot="error" slot-scope="{ trigger }">
            <div class="notification is-danger">
              <div class="buttons">
                <b-button type="is-primary" inverted @click="trigger">重试</b-button>
              </div>
              {{ errorMsg }}
            </div>
          </div>
        </infinite-loading>
      </div>
    </section>
  </section>
</template>

<script>
import CONFIG from '@/config.json'
import WaterFall from '@/components/waterfall'
export default {
  name: "Search",
  components: {
    WaterFall
  },
  data: () => {
    return {
      keyword: "",
      finalKeyword: "",
      suggestList: [],
      suggestdebu: null,
      errorMsg: "",
      mode: "illust",
      illustsPage: 0,
      illusts: [],
      loadid: +new Date(),
      queryFeatures: [],
      requestCancel: { }
    }
  },
  watch: {
    finalKeyword(){
      this.refresh(false)
    },
    mode(){
      this.refresh(true)
    },
    queryFeatures(){
      this.refresh(false)
    },
    $route() {
      this.keyword = this.$route.query.keyword
      this.finalKeyword = this.$route.query.keyword
      this.mode = this.$route.query.mode
      if (!this.mode) this.mode = "illust"
    }
  },
  created() {
    this.mode = this.$route.query.mode
    if (!this.mode) this.mode = "illust"
    this.keyword = this.$route.query.keyword
    this.finalKeyword = this.$route.query.keyword
    this.suggestdebu = this.Lodash.debounce(() => {
      if (this.keyword != "") {
        this.suggest()
      }
    },800)
  },
  mounted() {
    if(this.finalKeyword) {
      setTimeout(() => {
        this.$refs.infload.attemptLoad()
      }, 500)
    }
  },
  methods: {
    refresh(total=false) {
      this.illusts = []
      this.illustsPage = 0
      this.errorMsg = ""
      this.suggestList = []
      this.loadid += 1
      if (total) {
        this.finalKeyword = this.$route.query.keyword
        this.keyword = this.$route.query.keyword
      }
      for (let i in this.requestCancel) {
        this.requestCancel[i].cancel()
      }
      this.requestCancel = {}
    },
    searchonselect(keywd) {
      if(keywd){
        this.$router.push({ name: 'Search', query: { keyword: keywd, mode: this.mode }})
      }
    },
    search() {
      if (this.keyword != this.$route.query.keyword) {
        this.$router.push({ name: 'Search', query: { keyword: this.keyword, mode: this.mode }})
      }
    },
    suggest() {
      this.axios
        .get(CONFIG.API_HOST + `illust/search/${this.keyword}/suggest`)
        .then((response) => {
          if (response.data.error) {
            this.error(response.data.message)
            return;
          }
          this.suggestList = response.data.data.suggest_words
        }).catch((error)=>{
        this.error(error.response.data.message)
      })
    },
    illustsPageNext($state) {
      if (this.mode == "illust") {
        let params = {
          page: this.illustsPage,
          sortpop: this.queryFeatures.includes("sortpop"),
          sortdate: this.queryFeatures.includes("sortdate"),
        }
        let cancel = this.axios.CancelToken.source()
        let keyword = this.finalKeyword
        this.requestCancel[[keyword, JSON.stringify(params)].join(".")] = cancel
        this.axios
          .get(CONFIG.API_HOST + `illust/search/${keyword}`,{
            params,
            cancelToken: cancel.token
          })
          .then((response) => {
            delete this.requestCancel[[keyword, JSON.stringify(params)].join(".")]
            if (response.data.error) {
              this.error(response.data.message)
              $state.error()
              return;
            }
            if (!response.data.data.has_next) {
              $state.complete()
            }
            this.illusts = this.illusts.concat(response.data.data.illusts.map((illust, i) => {
              if (response.data.data.highlight[i] != null)
                illust["title"] = response.data.data.highlight[i]
              return illust
            }))
            this.illustsPage += 1
            $state.loaded()
          }).catch((error)=>{
          delete this.requestCancel[[keyword, JSON.stringify(params)].join(".")]
          this.error(error.response.data.message)
        })
      }
    },
    error(message) {
      this.$buefy.notification.open({
        duration: 5000,
        message: message,
        type: 'is-danger',
      })
      this.errorMsg = message
    }
  },
};
</script>

<style lang="scss">
.search-form {
  padding: {
    top: 2rem;
    bottom: 2rem;
    left: 0.75rem;
    right: 0.75rem;
  };
  .field {
    min-width: 20rem;
    .autocomplete {
      flex: 1;
    }
  }
  //min-width: 30rem;
}
</style>