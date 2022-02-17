<template>
  <div></div>
</template>

<script>
export default {
  name: "oldRedirect",
  created() {
    if (this.$route.path == "/user") {
      this.$router.push({
        name: "User",
        params: { id: this.$route.query.id },
      });
    } else if (this.$route.path == "/detail") {
      this.$router.push({
        name: "Detail",
        params: { id: this.$route.query.id },
      });
    }
  },
};
</script>

<style scoped></style>
