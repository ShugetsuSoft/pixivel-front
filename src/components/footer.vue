<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>Pixivel</strong> by
        <a href="https://shugetsu.dev/" target="_blank">Shugetsu Soft</a>.
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
import Banned from '@/assets/infos/ban.json'

export default {
  name: "Footer",
  mounted() {
    this.initAna()
    if (Banned.indexOf(window.location.href) == -1) {
      this.initAds()
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
          this.$refs.adbanner.innerText = "是ADBLOCK好耶";
          console.error(error);
        }
      };
      adscript.onerror = () => {
        this.$refs.adbanner.innerText = "唔，虽然这里本该有个广告，但是既然阁下不愿意的话，我也就不展示了。可以考虑捐赠支持开发者哦";
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
    }
  }
};
</script>

<style lang="scss">
.footer {
  padding: 3rem 1.5rem !important;
}
</style>
