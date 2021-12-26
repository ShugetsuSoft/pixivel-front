<template>
  <section class="default-full-screen-top">
    <div class="container search-form">
      <b-field>
        <p class="control">
          <b-dropdown v-model="mode">
            <template #trigger>
              <b-button
                label="插画"
                type="is-success"
                icon-right="menu-down" />
            </template>
            <b-dropdown-item value="illust">
              关键字搜索插画
            </b-dropdown-item>
            <b-dropdown-item value="tag">
              标签搜索插画
            </b-dropdown-item>
          </b-dropdown>
        </p>
        <b-autocomplete
          v-model="keyword"
          :data="suggestList"
          placeholder="试着输入些内容吧.."
          @select="searchonselect"
          icon="magnify"
          @typing="suggestdebu"
          @keyup.enter.native="search()"
          open-on-focus
          clearable>
          <template #empty>No results found</template>
        </b-autocomplete>
        <p class="control">
          <b-button class="button is-info" @click="search()">Search</b-button>
        </p>
      </b-field>
      <b-field>
        <b-checkbox-button v-model="queryFeatures" native-value="sortpop" type="is-danger" size="is-small">
          <b-icon icon="sort-descending" size="is-small"></b-icon>
          <span>热门度排序</span>
        </b-checkbox-button>
        <b-checkbox-button v-model="queryFeatures" native-value="sortdate" type="is-success" size="is-small">
          <b-icon icon="sort-clock-descending-outline" size="is-small"></b-icon>
          <span>时间排序</span>
        </b-checkbox-button>
      </b-field>
    </div>
    <section>
      <div class="container">
        <WaterFall :illusts="illusts" />
        <infinite-loading @infinite="illustsPageNext" spinner="spiral" v-if="finalKeyword!=''" :identifier="loadid" ref="infload">
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
      this.keyword = this.$route.params.keyword
      this.finalKeyword = this.$route.params.keyword

    }
  },
  created() {
    console.log(this.$route.query)
    this.keyword = this.$route.params.keyword
    this.finalKeyword = this.$route.params.keyword
    this.suggestdebu = this.Lodash.debounce(() => {
      if (this.keyword != "") {
        this.suggest()
      }
    },800)
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.infload.$emit('$InfiniteLoading:reset')
    })
  },
  methods: {
    refresh(total=false) {
      this.illusts = []
      this.illustsPage = 0
      this.errorMsg = ""
      this.suggestList = []
      this.loadid += 1
      if (total) {
        this.finalKeyword = ""
        this.keyword = ""
      }
      for (let i in this.requestCancel) {
        this.requestCancel[i].cancel()
      }
    },
    searchonselect(keywd) {
      if(keywd){
        this.$router.push({ name: 'Search', params: { keyword: keywd }})
      }
    },
    search() {
      if (this.keyword != this.$route.params.keyword) {
        this.$router.push({ name: 'Search', params: { keyword: this.keyword }})
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