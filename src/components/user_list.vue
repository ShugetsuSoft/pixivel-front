<template>
  <div class="userlist">
    <RouterA
      class="media is-vertical-centered"
      :to="{ name: 'User', params: { id: user.id } }"
      v-for="user in users"
      :key="user.id"
    >
      <div class="media-left">
        <figure class="image is-64x64">
          <img
            :src="imgProxy(user.image ? user.image.url : user.url, user.id)"
            class="is-rounded full-hw obj-cover"
          />
        </figure>
      </div>
      <div>
        <h1 class="title is-4 no-margin-bottom">{{ user.name }}</h1>
        <p class="break-raw-text">{{ user.bio | break }}</p>
      </div>
    </RouterA>
    <template v-if="hasLoad">
      <div
        class="media is-vertical-centered"
        v-for="i in 10"
        :key="i"
        ref="loadSpan"
      >
        <div class="media-left">
          <figure class="image is-64x64 is-rounded full-hw obj-cover">
            <b-skeleton circle height="64px" width="64px"></b-skeleton>
          </figure>
        </div>
        <div style="width: 100%">
          <b-skeleton width="60%" height="24px"></b-skeleton>
          <b-skeleton width="90%"></b-skeleton>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import RouterA from "@/components/router_a";

export default {
  name: "UserList",
  props: {
    users: Array,
    "has-load": Boolean,
  },
  components: {
    RouterA,
  },
  watch: {
    hasLoad: function () {
      if (this.hasLoad) {
        this.$nextTick(() => {
          let triggerEle = this.$refs.loadSpan[0];
          this.loadingObserver = new window.IntersectionObserver((entries) => {
            let entry = entries[0];
            this.onloading(entry);
          });
          this.loadingObserver.observe(triggerEle);
        });
      }
    },
  },
  data() {
    return {
      loadingObserver: null,
    };
  },
  mounted() {
    if (this.hasLoad) {
      let triggerEle = this.$refs.loadSpan[0];
      this.loadingObserver = new window.IntersectionObserver((entries) => {
        let entry = entries[0];
        this.onloading(entry);
      });
      this.loadingObserver.observe(triggerEle);
    }
  },
  computed: {},
  beforeDestroy() {
    if (this.loadingObserver) {
      this.loadingObserver.disconnect();
      this.loadingObserver = null;
    }
  },
  methods: {
    onloading(entry) {
      if (entry.intersectionRatio <= 0) return;
      this.$emit("load");
    },
  },
  filters: {
    break(content) {
      if (content.length > 20) {
        return content.substring(0, 20) + "...";
      }
      return content;
    },
  },
};
</script>

<style lang="scss">
.userlist {
  margin-top: 1rem;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  a {
    text-decoration: none !important;
  }
}
</style>
