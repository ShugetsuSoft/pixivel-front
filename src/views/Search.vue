<template>
  <section class="default-full-screen-top">
    <div class="container search-form" ref="search">
      <b-field>
        <p class="control">
          <b-dropdown v-model="mode">
            <template #trigger>
              <b-button
                :label="{ illust: '插画', user: '作者', image: '溯源' }[mode]"
                type="is-success"
                icon-right="uil uil-angle-down"
              />
            </template>
            <b-dropdown-item value="illust"> 关键字搜索插画 </b-dropdown-item>
            <b-dropdown-item value="user"> 搜索作者 </b-dropdown-item>
            <!--<b-dropdown-item value="image"> 以图搜图（溯源） </b-dropdown-item>-->
          </b-dropdown>
        </p>
        <b-autocomplete
          v-if="mode == 'illust' || mode == 'user'"
          v-model="keyword"
          placeholder="试着输入些内容吧.."
          @select="searchonselect"
          icon="uil-search"
          icon-pack="uil"
          @keyup.enter.native="search()"
          open-on-focus
        >
          <template #empty>No results found</template>
        </b-autocomplete>
        <b-upload
          v-if="mode == 'image'"
          drag-drop
          expanded
          accept="image/*"
          required
          validationMessage="Please select a file"
          v-model="imageFile"
        >
          <div class="has-text-centered">
            <p v-if="imageFile">已选择 {{ imageFile.name }}</p>
            <p v-else>选择一个文件~</p>
          </div>
        </b-upload>
        <p class="control">
          <b-button class="button is-info" @click="search()">搜索</b-button>
        </p>
      </b-field>
      <b-field v-if="mode == 'illust'">
        <b-checkbox-button
          v-model="queryFeatures"
          native-value="sortpop"
          type="is-danger"
          size="is-small"
        >
          <b-icon
            pack="uil"
            icon="uil-sort-amount-down"
            size="is-small"
          ></b-icon>
          <span>热门度排序</span>
        </b-checkbox-button>
        <b-checkbox-button
          v-model="queryFeatures"
          native-value="sortdate"
          type="is-success"
          size="is-small"
        >
          <b-icon pack="uil" icon="uil-clock" size="is-small"></b-icon>
          <span>时间排序</span>
        </b-checkbox-button>
      </b-field>
    </div>
    <section>
      <div class="container">
        <template v-if="finalKeyword">
          <template v-if="mode == 'illust'">
            <WaterFall :illusts="illusts" />
            <infinite-loading
              @infinite="illustsPageNext"
              spinner="spiral"
              :identifier="loadid"
              ref="infload"
            >
              <div slot="no-more">加载完毕</div>
              <div slot="no-results">记录为空</div>
              <div slot="error" slot-scope="{ trigger }">
                <div class="notification is-danger">
                  <div class="buttons">
                    <b-button type="is-primary" inverted @click="trigger"
                      >重试</b-button
                    >
                  </div>
                  {{ errorMsg }}
                </div>
              </div>
            </infinite-loading>
          </template>
          <template v-else-if="mode == 'user'">
            <UserList
              :users="users"
              :has-load="usersLoad"
              @load="usersPageNext"
            ></UserList>
            <br />
          </template>
        </template>
        <template v-else-if="mode == 'image'">
          <div class="image-preview">
            <b-image :src="previewImageSearch" ratio="6by4"></b-image>
          </div>
          <WaterFall :illusts="illusts" />
        </template>
      </div>
    </section>
  </section>
</template>

<script>
import CONFIG from "@/config.json";
import WaterFall from "@/components/waterfall";
import UserList from "@/components/user_list";

export default {
  name: "Search",
  components: {
    WaterFall,
    UserList,
  },
  data: () => {
    return {
      keyword: "",
      finalKeyword: "",
      errorMsg: "",
      mode: "illust",
      illustsPage: 0,
      illusts: [],
      users: [],
      usersLoad: true,
      loadid: +new Date(),
      queryFeatures: [],
      imageFile: null,
      previewImageSearch: null,
    };
  },
  watch: {
    finalKeyword() {
      this.refresh(false);
    },
    mode() {
      this.refresh(true);
      this.$router
        .push({
          name: "Search",
          query: {
            keyword: this.keyword,
            mode: this.mode,
            features: this.queryFeatures?.join(","),
          },
        })
        .catch(() => {});
    },
    queryFeatures() {
      this.$router
        .push({
          name: "Search",
          query: {
            keyword: this.keyword,
            mode: this.mode,
            features: this.queryFeatures.filter((n) => n).join(","),
          },
        })
        .catch(() => {});
      this.illusts = [];
      this.illustsPage = 0;
      this.$refs.infload.$emit("$InfiniteLoading:reset");
      this.$refs.infload.attemptLoad();

      //.refresh(true);
    },
    $route() {
      this.keyword = this.$route.query.keyword ? this.$route.query.keyword : "";
      this.finalKeyword = this.keyword;
      this.mode = this.$route.query.mode ? this.$route.query.mode : "illust";
      this.queryFeatures = this.$route.query.features?.split(",") || [];
    },

    imageFile() {
      if (this.imageFile != null) {
        this.previewImageSearch = URL.createObjectURL(this.imageFile);
      }
    },
  },
  created() {
    this.mode = this.$route.query.mode;
    if (!this.mode) this.mode = "illust";
    this.keyword = this.$route.query.keyword;
    this.finalKeyword = this.$route.query.keyword;
    this.queryFeatures = this.$route.query.features?.split(",") || [];
    this.imageFile = null;
    this.previewImageSearch = null;
  },
  mounted() {
    if (this.finalKeyword) {
      setTimeout(() => {
        if (this.$refs.infload) {
          this.$refs.infload.$emit("$InfiniteLoading:reset");
          this.$refs.infload.attemptLoad();
        }
      }, 1500);
    }
  },
  computed: {},
  methods: {
    refresh(total = false) {
      this.illusts = [];
      this.users = [];
      this.usersLoad = true;
      this.illustsPage = 0;
      this.errorMsg = "";
      this.loadid += 1;
      this.previewImageSearch = null;
      this.imageFile = null;
      if (total) {
        this.finalKeyword = this.$route.query.keyword;
        this.keyword = this.$route.query.keyword;
        this.queryFeatures = this.$route.query.features?.split(",") || [];
      }
      this.$store.commit("CancelRequests/clearCancelToken");
    },
    searchonselect(keywd) {
      if (keywd) {
        this.$router
          .push({
            name: "Search",
            query: {
              keyword: keywd,
              mode: this.mode,
              features: this.queryFeatures?.join(","),
            },
          })
          .catch(() => {});
      }
    },
    searchImage() {
      if (this.imageFile == null) {
        return;
      }
      let loader = this.$buefy.loading.open({
        container: this.$refs.search.$el,
        isFullPage: false,
      });
      console.log(this.imageFile);

      let formdata = new FormData();
      formdata.append("file", this.imageFile);

      this.axios
        .post(CONFIG.PIXGRID_API_V3_HOST + "search", formdata, {
          method: "POST",
        })
        .then((response) => {
          if (response.data.status !== 0) {
            this.error(response.data.message);
            return;
          }

          this.illusts = response.data.illusts;

          loader.close();
          this.imageFile = null;
        })
        .catch((error) => {
          loader.close();
          this.error(error.message);
        });
    },
    search() {
      if (this.mode == "image") {
        this.searchImage();
        return;
      }
      if (this.keyword != this.$route.query.keyword) {
        this.$router
          .push({
            name: "Search",
            query: {
              keyword: this.keyword,
              mode: this.mode,
              features: this.queryFeatures.join(","),
            },
          })
          .catch(() => {});
      }
    },
    illustsPageNext($state) {
      if (this.mode == "illust") {
        let sort = "relevent";
        if (this.queryFeatures.includes("sortpop")) {
          sort = "popular";
        } else if (this.queryFeatures.includes("sortdate")) {
          sort = "time";
        }
        let params = {
          page: this.illustsPage,
          sort: sort,
        };
        let keyword = this.finalKeyword;
        this.axios
          .get(CONFIG.API_V3_HOST + `search/illust/${keyword}`, {
            params,
          })
          .then((response) => {
            if (response.data.status !== 0) {
              this.error(response.data.message);
              $state.error();
              return;
            }
            if (!response.data.data.has_next) {
              $state.complete();
            }
            this.illusts = this.illusts.concat(response.data.data.illusts);
            this.illustsPage += 1;
            $state.loaded();
          })
          .catch((error) => {
            this.error(error.message);
          });
      }
    },
    usersPageNext() {
      let params = {
        page: this.illustsPage,
      };
      let keyword = this.finalKeyword;
      this.axios
        .get(CONFIG.API_V3_HOST + `search/illustrator/${keyword}`, {
          params,
        })
        .then((response) => {
          if (response.data.status !== 0) {
            this.error(response.data.message);
            this.usersLoad = false;
            return;
          }
          if (!response.data.data.has_next) {
            this.usersLoad = false;
          }
          this.users = this.users.concat(response.data.data.users);
          this.illustsPage += 1;
        })
        .catch((error) => {
          this.error(error.message);
        });
    },
    error(message) {
      this.$buefy.notification.open({
        duration: 5000,
        message: message,
        type: "is-danger",
      });
      this.errorMsg = message;
    },
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
  }
  .field {
    min-width: 20rem;
    .autocomplete {
      flex: 1;
    }
  }
  //min-width: 30rem;
}

.image-preview {
  width: 30%;
  margin: auto;
}
</style>
