<template>
  <a>
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: "RouterA",
  props: {
    to: {
      type: Object,
    },
    handle: {
      type: Function,
    },
  },
  methods: {
    guardEvent(e) {
      if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
        return;
      }
      if (e.defaultPrevented) {
        return;
      }
      if (e.button !== undefined && e.button !== 0) {
        return;
      }
      if (e.currentTarget && e.currentTarget.getAttribute) {
        var target = e.currentTarget.getAttribute("target");
        if (/\b_blank\b/i.test(target)) {
          return;
        }
      }
      if (e.preventDefault) {
        e.preventDefault();
      }
      return true;
    },
  },
  mounted() {
    var guardEvent = this.guardEvent;
    var router = this.$router;
    var handle = this.handle;
    var current = this.$route;
    var ref = router.resolve(this.to, current);
    var location = ref.location;
    this.handler = function (e) {
      if (guardEvent(e)) {
        if (handle) {
          handle();
        }
        router.push(location).catch(() => {});
        return false;
      }
    };
    this.$el.href = ref.href;
    this.$el.addEventListener("click", this.handler, false);
  },
  activated() {
    this.$el.addEventListener("click", this.handler, false);
  },
  deactivated() {
    this.$el.removeEventListener("click", this.handler, false);
  },
  beforeDestroy() {
    this.$el.removeEventListener("click", this.handler, false);
  },
  destroyed() {
    this.$el.removeEventListener("click", this.handler, false);
  },
};
</script>

<style></style>
