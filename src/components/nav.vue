<template></template>

<script>
export default {
  name: "Nav",
  watch: {
    active: "route",
    $route: "router",
  },
  data: () => ({
    active: "/",
  }),
  methods: {
    route(val) {
      if (val != this.$route.path) this.$router.push(val);
    },
    router() {
      if (this.active != this.$route.path) this.active = this.$route.path;
    },
  },
  created() {
    this.active = this.$route.path;
  },
};
</script>

<style lang="scss"></style>
