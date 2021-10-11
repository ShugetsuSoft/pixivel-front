<template>
  <section class="default-full-screen-top">
    <div class="container search-form">
      <div class="columns is-mobile">
        <div class="column is-narrow">
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
        </div>
        <div class="column">
          <b-autocomplete
            v-model="keyword"
            :data="suggestList"
            placeholder="试着输入些内容吧.."
            @select="searchonselect"
            icon="magnify"
            @typing="suggestdebu"
            @keyup.enter.native="finalKeyword=keyword"
            open-on-focus
            clearable>
            <template #empty>No results found</template>
          </b-autocomplete>
        </div>
      </div>
    </div>
    <section>
      <div class="container">
        <WaterFall :illusts="illusts" />
        <infinite-loading @infinite="illustsPageNext" spinner="spiral" v-if="finalKeyword!=''" :identifier="loadid">
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
    }
  },
  watch: {
    "finalKeyword": function(){
      this.refresh(false)
    },
    //"mode": "()=>refresh(true)"
  },
  created() {
    this.suggestdebu = this.Lodash.debounce(() => {
      if (this.keyword != "") {
        this.suggest()
      }
    },800)
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
    },
    searchonselect(keywd) {
      console.log(keywd)
      if(keywd!=''&&keywd!=null){
        this.finalKeyword=keywd
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
        this.axios
          .get(CONFIG.API_HOST + `illust/search/${this.finalKeyword}`,{
            params: {
              page: this.illustsPage
            }
          })
          .then((response) => {
            if (response.data.error) {
              this.error(response.data.message)
              $state.error()
              return;
            }
            if (!response.data.data.has_next) {
              $state.complete()
            }
            this.illusts = this.illusts.concat(response.data.data.illusts)
            this.illustsPage += 1
            $state.loaded()
          }).catch((error)=>{
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
  };
  //min-width: 30rem;
}
</style>