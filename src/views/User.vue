<template>
  <section class="default-full-screen-top">
    <section class="hero user-banner is-medium">
      <LoadImg :src="background" :imgkey="id" v-if="user" />
    </section>
    <section class="hero profile">
      <div class="hero-body container is-widescreen">
        <figure class="image profile-ava is-rounded">
          <b-skeleton circle v-if="!user"></b-skeleton>
          <LoadImg
            :src="user.image.bigUrl"
            class="full-hw"
            :imgkey="id"
            v-else
          />
        </figure>

        <h1 class="title is-2 has-text-centered">
          {{ user ? user.name : "" }}
          <b-skeleton
            width="130px"
            height="2rem"
            v-if="!user"
            position="is-centered"
          ></b-skeleton>
        </h1>
        <div class="button-container">
          <template v-if="islogin">
            <Follow :user="user" v-if="user" />
          </template>
          <ShareButton
            :type="1"
            :id="user.id"
            style="margin-left: 10px"
            v-if="user"
            :info="user.name"
          />
        </div>
        <hr />
        <p class="subtitle is-6 bio-container break-raw-text">
          <template v-if="!user">
            <b-skeleton width="20%"></b-skeleton>
            <b-skeleton width="40%"></b-skeleton>
            <b-skeleton width="80%"></b-skeleton>
          </template>
          {{ user ? user.bio : "" }}
        </p>
      </div>
    </section>
    <div class="container" v-if="user">
      <WaterFall :illusts="userIllusts" />
      <infinite-loading @infinite="illustsPageNext" spinner="spiral">
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
      <LongLoadingBadage ref="longloading_badage"
        >可能是第一次加载...正在获取全部插画，请耐心等待...</LongLoadingBadage
      >
    </div>
  </section>
</template>

<script>
import CONFIG from "@/config.json";
import WaterFall from "@/components/waterfall";
import LoadImg from "@/components/load_img.vue";
import LongLoadingBadage from "@/components/longloading_badage";
import Follow from "@/components/follow_button";
import { isLoggedIn } from "@/utils/account";
import ShareButton from "@/components/share_button";

export default {
  name: "User",
  components: {
    WaterFall,
    LoadImg,
    LongLoadingBadage,
    Follow,
    ShareButton,
  },
  data() {
    return {
      id: 0,
      loading: null,
      errorMsg: "",
      user: null,
      userIllusts: [],
      illustsPage: 0,
      islogin: isLoggedIn(),
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.loading = this.$buefy.loading.open();
  },
  mounted() {
    let cached = this.$store.getters["Cache/get"](
      {
        type: "user",
        id: this.id,
      },
      null
    );
    if (cached) {
      this.user = cached;
      this.loading.close();
    } else {
      this.axios
        .get(CONFIG.API_HOST + `user/${this.id}`)
        .then((response) => {
          if (response.data.error) {
            this.error(response.data.message);
            return;
          }
          this.user = response.data.data;
          this.loading.close();
          this.$store.commit("Cache/cacheState", {
            key: {
              type: "user",
              id: this.id,
            },
            val: this.user,
          });
        })
        .catch((error) => {
          this.error(error.response.data.message);
          this.loading.close();
        });
    }
    this.illustsInit();
  },
  methods: {
    error(message) {
      this.$buefy.notification.open({
        duration: 5000,
        message: message,
        type: "is-danger",
      });
      this.errorMsg = message;
    },
    illustsInit() {
      let cachedUesrIllusts = this.$store.getters["Cache/get"](
        {
          type: "userIllust",
          id: this.id,
        },
        null
      );
      if (cachedUesrIllusts) {
        this.illustsPage = cachedUesrIllusts["page"];
        this.userIllusts = cachedUesrIllusts["illusts"];
      }
    },
    illustsPageNext($state) {
      this.$refs.longloading_badage.start();
      this.axios
        .get(CONFIG.API_HOST + `user/${this.id}/illusts`, {
          params: {
            page: this.illustsPage,
          },
        })
        .then((response) => {
          this.$refs.longloading_badage.stop();
          if (response.data.error) {
            this.error(response.data.message);
            $state.error();
            return;
          }
          if (!response.data.data.has_next) {
            $state.complete();
          }
          this.userIllusts = this.userIllusts.concat(
            response.data.data.illusts
          );
          this.illustsPage += 1;
          $state.loaded();
          this.$store.commit("Cache/cacheState", {
            key: {
              type: "userIllust",
              id: this.id,
            },
            val: {
              page: this.illustsPage,
              illusts: this.userIllusts,
              showloading: response.data.data.has_next,
            },
          });
        })
        .catch((error) => {
          this.error(error);
          $state.error();
          this.$refs.longloading_badage.stop();
        });
    },
  },
  computed: {
    background() {
      if (this.user.image.background) {
        return this.user.image.background;
      } else {
        if (this.userIllusts.length > 0) {
          for (let i = 0; i < this.userIllusts.length; i++) {
            if (this.userIllusts[i].width > this.userIllusts[i].height) {
              return this.calcImg(
                this.userIllusts[i].id,
                0,
                this.userIllusts[i].image,
                "regular"
              );
            }
          }
          return this.calcImg(
            this.userIllusts[0].id,
            0,
            this.userIllusts[0].image,
            "regular"
          );
        } else {
          return "";
        }
      }
    },
  },
};
</script>

<style lang="scss">
.user-banner {
  height: 27rem;
}

.profile {
  box-shadow: 1px -8px 8px rgba(0, 0, 0, 0.175);
  @media screen and (min-width: 790px) {
    .profile-ava {
      height: 210px !important;
      width: 210px !important;
    }
  }
  .profile-ava {
    height: 170px;
    width: 170px;
    margin-top: -8rem;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 2rem;
    overflow: hidden;
    .b-skeleton {
      height: 100%;
      width: 100%;
      .b-skeleton-item {
        height: 100%;
        width: 100%;
      }
    }
    .lazyimg {
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.175);
    }
  }

  .button-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  .bio-container {
    max-height: 14rem;
    min-width: 47.5rem;
    overflow-y: auto;
  }
}

@media screen and (max-width: 790px) {
  .profile {
    .bio-container {
      min-width: auto !important;
    }
  }
}
</style>
