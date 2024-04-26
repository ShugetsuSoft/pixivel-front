<template>
  <div ref="turnstileBox" id="turnstile-box"></div>
</template>

<script>
export default {
  name: "Turnstile",
  props: {
    sitekey: {
      type: String,
      required: true,
    },
  },
  mounted() {
    if (window.turnstile === null || !window.turnstile) {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    this.renderTurnstile();
  },
  methods: {
    renderTurnstile() {
      window.onloadTurnstileCallback = () => {
        window.turnstile.render("#turnstile-box", {
          sitekey: this.sitekey,
          callback: (response) => this.$emit("verify", response),
          "expired-callback": this.$emit("expire"),
          "error-callback": this.$emit("fail"),
        });
      };
    },
    reload() {
      this.$refs.turnstileBox.childNodes.forEach((child) => {
        this.$refs.turnstileBox.removeChild(child);
      });
      window.turnstile.render("#turnstile-box", {
        sitekey: this.sitekey,
        callback: (response) => this.$emit("verify", response),
        "expired-callback": this.$emit("expire"),
        "error-callback": this.$emit("fail"),
      });
    },
  },
};
</script>

<style scoped></style>
