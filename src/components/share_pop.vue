<template>
  <div class="box has-text-centered">
    <b-field label="分享链接">
      <b-input v-model="url" id="copyInput"></b-input>
      <p class="control">
        <b-button
          class="button is-info"
          id="copy"
          data-clipboard-target="#copyInput"
          >复制</b-button
        >
      </p>
    </b-field>
    <label class="label">直接发送</label>
    <div class="social-container">
      <a
        class="social-icon-box"
        v-for="(s, i) in social"
        :key="i"
        :style="{ 'background-color': s.color }"
        v-html="s.logo"
        :href="s.url"
        target="_blank"
      ></a>
    </div>
  </div>
</template>

<script>
import CONFIG from "@/config.json";
import ClipboardJS from "clipboard";

export default {
  name: "SharePop",
  props: {
    type: Number,
    id: Number,
    info: String,
  },
  data() {
    return {
      clipboard: null,
    };
  },
  computed: {
    url() {
      let baseUrl = CONFIG.SHARE_LINK;
      if (this.type == 0) {
        baseUrl += "pxi";
      } else if (this.type == 1) {
        baseUrl += "pxu";
      }
      baseUrl += "/";
      baseUrl += this.id.toString();
      return baseUrl;
    },
    shareQzone() {
      let desc = "";
      if (this.type == 0) {
        desc += "分享自 Pixivel 的插画：";
      } else {
        desc += "分享自 Pixivel 的画师：";
      }
      desc += this.info;
      let shareUrl = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=${encodeURIComponent(
        this.info
      )}&url=${this.url}`;
      shareUrl += `&desc=${encodeURIComponent(desc)}`;
      return shareUrl;
    },
    shareWeibo() {
      let shareUrl = `http://v.t.sina.com.cn/share/share.php?title=${encodeURIComponent(
        this.info
      )}&url=${this.url}`;
      return shareUrl;
    },
    shareQQ() {
      let desc = "";
      if (this.type == 0) {
        desc += "分享自 Pixivel 的插画：";
      } else {
        desc += "分享自 Pixivel 的画师：";
      }
      desc += this.info;
      let shareUrl = `http://connect.qq.com/widget/shareqq/index.html?url=${
        this.url
      }&title=${encodeURIComponent(this.info)}&source=${
        this.url
      }&desc=${encodeURIComponent(desc)}&summary=${encodeURIComponent(desc)}`;
      return shareUrl;
    },
    social() {
      return [
        {
          logo: '<svg viewBox="0 0 31.617 31.617"><path d="M25.694,13.182c0.268-0.915,0.416-1.88,0.416-2.881C26.11,4.612,21.5,0,15.81,0c-5.688,0-10.3,4.611-10.3,10.301,c0,1.001,0.149,1.966,0.416,2.881c-1.297,1.042-6.331,5.557-4.26,11.412c0,0,1.752-0.15,3.191-2.811,c0.437,1.703,1.251,3.25,2.361,4.543c-1.626,0.479-2.729,1.408-2.729,2.474c0,1.556,2.348,2.817,5.243,2.817,c1.965,0,3.676-0.582,4.573-1.44c0.494,0.065,0.992,0.11,1.503,0.11c0.512,0,1.011-0.045,1.503-0.11,c0.899,0.858,2.609,1.44,4.574,1.44c2.896,0,5.245-1.262,5.245-2.817c0-1.065-1.104-1.995-2.73-2.474,c1.109-1.293,1.925-2.84,2.362-4.543c1.438,2.66,3.188,2.811,3.188,2.811C32.024,18.738,26.99,14.223,25.694,13.182z" fill="currentColor"></path></svg>',
          color: "#2aae67",
          url: this.shareQQ,
        },
        {
          logo: '<svg viewBox="0 0 32 32"><path d="M31.979 12.271c-.042-.135-.167-.297-.443-.344l-9.802-1.875s-.141-.031-.266-.094c-.12-.063-.167-.224-.167-.224s-4.708-8.458-4.839-8.708c-.13-.25-.323-.318-.464-.318s-.333.068-.464.318c-.13.25-4.839 8.708-4.839 8.708s-.047.161-.167.224c-.125.063-.266.094-.266.094S.736 11.875.46 11.922c-.276.052-.401.214-.443.344a.632.632 0 0 0 .167.599l7.151 7.323s.094.104.156.229c.021.135.005.281.005.281s-1.583 9.656-1.625 9.932a.61.61 0 0 0 .214.573c.109.083.307.141.557.016c.255-.125 9.083-4.349 9.083-4.349s.13-.057.271-.078c.135-.026.266.078.266.078s8.833 4.224 9.083 4.349s.453.068.563-.016a.63.63 0 0 0 .214-.573l-1.245-7.568c1.172-.724 1.901-1.385 2.469-2.333c-3.458 1.292-8.01 2.292-12.552 2.49c-1.224.052-3.214.13-4.635-.021c-.901-.094-1.557-.193-1.656-.583c-.068-.286.073-.615.729-1.109c1.271-.958 2.542-1.917 3.813-2.87c1.714-1.292 4.745-3.297 4.745-3.646c0-.375-2.859-1.036-5.38-1.036c-2.594 0-3.036.172-3.75.224c-.651.042-1.026.005-1.073-.188c-.078-.328.245-.516.786-.755c.943-.422 2.479-.792 2.646-.833c.26-.073 4.109-1.078 7.49-.714c1.755.182 4.328.891 4.328 1.698c0 .458-2.297 1.995-4.302 3.464c-1.531 1.125-2.958 2.083-2.958 2.25c0 .458 4.714 1.656 8.922 1.349l.005-.031c.063-.12.156-.229.156-.229l7.151-7.318a.637.637 0 0 0 .167-.599z" fill="currentColor"></path></svg>',
          color: "#ffcd00",
          url: this.shareQzone,
        },
        {
          logo: '<svg viewBox="0 0 24 24"><path d="M17.525 11.378c1.263.392 2.669 1.336 2.669 3.004c0 2.763-3.98 6.239-9.964 6.239c-4.565 0-9.23-2.213-9.23-5.852c0-1.902 1.204-4.102 3.277-6.177c2.773-2.77 6.004-4.033 7.219-2.816c.537.537.588 1.464.244 2.572c-.178.557.525.25.525.25c2.24-.938 4.196-.994 4.909.027c.38.543.343 1.306-.008 2.19c-.163.407.048.471.36.563zm-7.282 7.939c3.641-.362 6.401-2.592 6.167-4.983c-.237-2.391-3.382-4.038-7.023-3.677c-3.64.36-6.403 2.59-6.167 4.98c.237 2.394 3.382 4.039 7.023 3.68zM6.16 14.438c.754-1.527 2.712-2.39 4.446-1.94c1.793.463 2.707 2.154 1.976 3.8c-.744 1.682-2.882 2.578-4.695 1.993c-1.752-.566-2.493-2.294-1.727-3.853zm1.446 2.587c.568.257 1.325.013 1.676-.55c.346-.568.163-1.217-.407-1.459c-.563-.237-1.291.008-1.64.553c-.354.547-.189 1.202.371 1.456zm2.206-1.808c.219.092.501-.012.628-.231c.123-.22.044-.466-.178-.548c-.216-.084-.486.018-.613.232c-.123.214-.054.458.163.547zM19.873 9.5a.725.725 0 1 1-1.378-.451a1.38 1.38 0 0 0-.288-1.357a1.395 1.395 0 0 0-1.321-.425a.723.723 0 1 1-.303-1.416a2.836 2.836 0 0 1 3.29 3.649zm-3.916-6.575A5.831 5.831 0 0 1 21.5 4.72a5.836 5.836 0 0 1 1.22 5.704a.838.838 0 0 1-1.06.54a.844.844 0 0 1-.542-1.062a4.143 4.143 0 0 0-4.807-5.327a.845.845 0 0 1-.354-1.65z" fill="currentColor"></path></svg>',
          color: "#d52c2b",
          url: this.shareWeibo,
        },
      ];
    },
  },
  methods: {},
  mounted() {
    this.clipboard = new ClipboardJS("#copy");
    this.clipboard.on("success", () => {
      this.$buefy.snackbar.open({
        message: "复制成功！",
        type: "is-success",
        position: "is-top",
      });
    });
    this.clipboard.on("error", () => {
      this.$buefy.snackbar.open({
        message:
          "您的浏览器不支持由页面发起的复制。可以手动复制链接进行分享。",
        type: "is-error",
        position: "is-top",
      });
    });
  },
  beforeDestroy() {
    this.clipboard.destroy();
  },
};
</script>

<style lang="scss">
.social-container {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;

  .social-icon-box {
    height: 50px;
    width: 50px;
    padding: 8px;
    margin: 0;
    color: #fff;
    &:first-child {
      border-bottom-left-radius: 10px;
      border-top-left-radius: 10px;
    }
    &:last-child {
      border-bottom-right-radius: 10px;
      border-top-right-radius: 10px;
    }
  }
}
</style>
