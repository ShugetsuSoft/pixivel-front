<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>&copy; Pixivel</strong> by
        <a href="https://shugetsu.dev/" target="_blank">Shugetsu Soft</a>. Not
        affiliated with pixiv Inc.
        <br />
        <a href="https://policy.shugetsu.dev/terms.html" target="_blank"
          >Terms</a
        >
        |
        <a href="https://policy.shugetsu.dev/privacy.html" target="_blank"
          >Privacy</a
        >
      </p>
      <p>追逐梦想的人，最后只会剩死路一条</p>
    </div>
  </footer>
</template>

<script>

export default {
  name: "Footer",
  mounted() {
    this.initAna();
  },
  methods: {
    initAna() {
      let analyticscript = document.createElement("script");
      analyticscript.src = "https://analytics.rorical.blue/script.js";
      analyticscript.async = true;
      analyticscript.defer = true;
      analyticscript.setAttribute(
        "data-website-id",
        "3be74123-a4c6-493e-a059-266c718ac386"
      );
      document.head.appendChild(analyticscript);
    }
  },
};
</script>

<style lang="scss">
.footer {
  padding: 3rem 1.5rem !important;
}
</style>
