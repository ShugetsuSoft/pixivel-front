<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>&copy; Pixivel</strong> by
        <a href="https://shugetsu.dev/" target="_blank">Shugetsu Soft</a>. Not
        affiliated with pixiv Inc. .
        <br />
        <a href="https://policy.shugetsu.dev/terms.html" target="_blank"
          >Terms</a
        >
        |
        <a href="https://policy.shugetsu.dev/privacy.html" target="_blank"
          >Privacy</a
        >
      </p>

      <p ref="adbanner">这里应该会有个广告用来支持运营</p>
      <div id="adcontainer"></div>
    </div>
  </footer>
</template>

<script>
import Banned from "@/assets/info/ban.json";

export default {
  name: "Footer",
  mounted() {
    this.initAna();
    if (Banned.indexOf(window.location.href) === -1) {
      const cancel = setTimeout(() => {
        this.initAds();
      }, 3000);
      const cancelAdsLoadHook = () => {
        clearTimeout(cancel);
        this.bus.off("block", cancelAdsLoadHook);
      };
      this.bus.on("block", cancelAdsLoadHook);
    }
  },
  methods: {
    initAds() {
      window.atOptions = {
        key: "5bd04ec1ba9e7d164ae3212efc50d3e8",
        format: "iframe",
        height: 50,
        width: 320,
        params: {},
      };
      let adscript = document.createElement("script");
      adscript.type = "text/javascript";
      adscript.onerror = () => {
        this.$refs.adbanner.innerText =
          "我们理解您对互联网广告的厌恶，我们也在不断探索更加用户友好的运营策略；但目前，我们依然依赖于广告收入支撑服务运行。请考虑对本站点解除您的AdBlock，或者选择捐赠以支持本站点长期发展。";
      };
      adscript.src =
        "//www.topcreativeformat.com/5bd04ec1ba9e7d164ae3212efc50d3e8/invoke.js";
      window.document.getElementById("adcontainer").appendChild(adscript);
    },
    initAna() {
      let analyticscript = document.createElement("script");
      analyticscript.type = "text/javascript";
      analyticscript.src = "https://analytics.rorical.blue/script.js";
      analyticscript.async = true;
      analyticscript.defer = true;
      analyticscript.setAttribute(
        "data-website-id",
        "3be74123-a4c6-493e-a059-266c718ac386"
      );
      document.head.appendChild(analyticscript);
    },
  },
};
</script>

<style lang="scss">
.footer {
  padding: 3rem 1.5rem !important;
}
</style>
