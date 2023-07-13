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
      <ins
        class="adsbygoogle"
        style="display: block"
        data-ad-client="ca-pub-7564284646329791"
        data-ad-slot="6050058983"
        data-ad-format="auto"
      ></ins>
    </div>
  </footer>
</template>

<script>
import Banned from "@/assets/info/ban.json";

export default {
  name: "Footer",
  mounted() {
    this.initAna();
    if (Banned.indexOf(window.location.href) == -1) {
      this.initAds();
    }
  },
  methods: {
    initAds() {
      let adscript = document.createElement("script");
      adscript.type = "text/javascript";
      adscript.onload = () => {
        try {
          (window.adsbygoogle || []).push({});
        } catch (error) {
          this.$refs.adbanner.innerText =
            "请考虑对本站点解除您的AdBlock以支持本站点长期发展。";
          console.error(error);
        }
      };
      adscript.onerror = () => {
        this.$refs.adbanner.innerText =
          "我们理解您对互联网广告的厌恶，我们也在不断探索更加用户友好的运营策略；但目前，我们依然依赖于广告收入支撑服务运行。请考虑对本站点解除您的AdBlock，或者选择捐赠以支持本站点长期发展。";
      };
      adscript["data-ad-client"] = "ca-pub-7564284646329791";
      adscript.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7564284646329791";
      document.currentScript.parentNode.insertBefore(
        adscript,
        document.currentScript
      );
    },
    initAna() {
      let analyticscript = document.createElement("script");
      analyticscript.type = "text/javascript";
      analyticscript.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          window.dataLayer.push(arguments);
        }
        gtag("js", new Date());
        gtag("config", "UA-159010258-1");
      };
      analyticscript.src =
        "https://www.googletagmanager.com/gtag/js?id=UA-159010258-1";
      document.currentScript.parentNode.insertBefore(
        analyticscript,
        document.currentScript
      );
    },
  },
};
</script>

<style lang="scss">
.footer {
  padding: 3rem 1.5rem !important;
}
</style>
