<template>
  <RouterA :to="{ name: 'Detail', params: { id: illust.id } }">
    <LazyImg :src="url" @loaded="loaded" @preloaded="loaded" />
    <div class="loading-overlay" :class="{ 'is-active': loading }">
      <div class="loading-background"></div>
      <div class="loading-icon"></div>
    </div>
    <div class="page-count">
      <b-tag type="is-info" v-if="illust.pageCount > 1">
        <b-icon pack="uil" icon="uil-layers" size="is-small"></b-icon>
        {{ illust.pageCount }}
      </b-tag>
      <b-tag type="is-primary" v-if="illust.type == 2">
        <b-icon pack="uil" icon="uil-video" size="is-small"></b-icon>
      </b-tag>
    </div>
    <div class="page-operation" v-if="islogin">
      <Like :illust="illust" />
    </div>
    <div class="title-container">
      <h5 class="title is-5 has-text-white" v-html="illust.title"></h5>
    </div>
  </RouterA>
</template>

<script>
import LazyImg from "@/components/lazyimg";
import RouterA from "@/components/router_a";
import { isLoggedIn } from "@/utils/account";
import Like from '@/components/like_heart'

export default {
  name: "ImgCard",
  props: {
    illust: Object,
    width: Number,
    quality: {
      default: "small",
      type: String,
    },
  },
  components: {
    LazyImg,
    RouterA,
    Like
  },
  data() {
    return {
      loading: true,
      islogin: isLoggedIn(),
    };
  },
  mounted() {},
  computed: {
    url() {
      return this.calcImg(
        this.illust.id,
        this.illust.type == 2 ? -1 : 0,
        this.illust.image,
        this.quality
      );
    },
  },
  methods: {
    loaded() {
      this.loading = false;
    },
  },
};
</script>

<style lang="scss">
.masonry-item {
  overflow: hidden;
  animation: show 0.5s forwards;
  opacity: 0;

  box-shadow: 0 0 8px rgba(0, 0, 0, 0.18);

  border: {
    radius: 12px;
  }

  .page-count {
    position: absolute;
    top: 10px;
    right: 14px;

    .is-info {
      opacity: 0.7;

      .icon {
        padding-right: 3px;
        padding-left: 1px;
      }
    }
  }

  .page-operation {
    position: absolute;
    bottom: 10px;
    right: 16px;
    width: 1.8rem;
    height: 1.8rem;
  }

  .title-container {
    position: absolute;
    right: 0;
    left: 0;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    padding-left: 0;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
    transition: opacity 0.25s ease-in-out;
    opacity: 0;
    bottom: 50%;
    transform: translateY(50%);

    em {
      color: rgb(111, 255, 229);
      font-style: normal;
    }
  }

  &:hover {
    .title-container {
      opacity: 1;
    }

    div.lazyimg {
      transform: scale(1.1);

      &:after {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }

  div.lazyimg {
    transition: transform 0.45s ease-in-out;

    &:after {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 0;
      content: "";
      transition: 0.2s;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
    }
  }
}

@keyframes show {
  from {
    visibility: hidden;
    opacity: 0;
    margin-top: 40px;
  }
  to {
    visibility: visible;
    opacity: 1;
    margin-top: 0px;
  }
}
</style>
