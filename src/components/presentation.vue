<template>
  <div ref="presentation">
    <div class="presentation" :style="{ width: width + 'px' }">
      <div
        class="presentation-img"
        :style="{ height: height + 'px' }"
        ref="presentation-img"
      >
        <div class="loading-overlay" :class="{ 'is-active': loading }">
          <div class="loading-background"></div>
          <div class="loading-icon"></div>
        </div>
        <img
          :src="CurrentImgUrl"
          :alt="id + '-' + pageCount"
          :class="{ 'onepx-blur': loading }"
        />
      </div>
    </div>
    <Pagination
      :max-page="pageCount"
      v-model="CurrentPage"
      v-if="pageCount > 1"
    />
  </div>
</template>

<script>
import Pagination from "@/components/pagination.vue";
import JSZip from "jszip";

export default {
  name: "Presentation",
  components: {
    Pagination,
  },
  props: {
    id: Number,
    image: [String, Number],
    "page-count": Number,
    "initial-width": Number,
    "initial-height": Number,
    "ugoira-frames": Array,
  },
  watch: {
    ugoiraFrames: "loadUgoira",
    CurrentPage: "switchPage",
    containerWidth: "resizeImg",
    windowHeight: "resizeImg",
    imgWidth: "resizeImg",
    imgHeight: "resizeImg",
  },
  data() {
    return {
      MaxPercent: 0.94,
      CurrentImgUrl:
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      CurrentPage: 1,
      width: 0,
      height: 0,
      containerWidth: 0,
      windowHeight: 0,
      imgWidth: this.initialWidth,
      imgHeight: this.initialHeight,
      windowWidth: 0,
      parentObserver: null,
      urlList: [],
      loadedList: [],
      loading: true,
      ugoiraImages: {},
      ugoiraPlaying: false,
    };
  },
  created() {
    let smallImgUrl = "";
    if (this.pageCount == -1) {
      smallImgUrl = this.calcImg(this.id, -1, this.image, "small");
    } else {
      smallImgUrl = this.calcImg(this.id, 0, this.image, "small");
    }
    if (this.$store.getters["Pic/hasCached"](smallImgUrl)) {
      this.CurrentImgUrl = smallImgUrl;
    }
  },
  mounted() {
    var parentNode = this.$refs.presentation.parentNode;
    this.parentObserver = new window.ResizeObserver((entries) => {
      var entry = entries[0];
      this.containerResized(entry);
    });
    this.parentObserver.observe(parentNode);
    window.addEventListener("resize", this.windowResized, false);
    this.windowResized();
    if (this.pageCount != -1) {
      this.preLoad();
    }
  },
  beforeDestroy() {
    if (this.parentObserver) {
      this.parentObserver.disconnect();
      this.parentObserver = null;
    }
    window.removeEventListener("resize", this.windowResized, false);
    for (let i in this.loadedList) {
      URL.revokeObjectURL(i);
    }
    if (Object.keys(this.ugoiraImages).length > 0) {
      for (let i in this.ugoiraImages) {
        URL.revokeObjectURL(this.ugoiraImages[i]);
      }
    }
  },
  computed: {},
  methods: {
    preLoad() {
      this.urlList = [];
      for (let i = 0; i < this.pageCount; ++i) {
        let src = this.calcImg(this.id, i, this.image, "regular");
        this.urlList.push(src);
      }
      this.switchPage();
    },
    switchPage() {
      var url = this.urlList[this.CurrentPage - 1];
      let loaded = this.loadedList[this.CurrentPage - 1];
      if (this.CurrentPage == 1) {
        this.imgWidth = this.initialWidth;
        this.imgHeight = this.initialHeight;
      }
      if (loaded) {
        if (this.CurrentPage != 1) {
          let preloader = new Image();
          preloader.src = loaded;
          preloader.onload = () => {
            this.imgWidth = preloader.naturalWidth;
            this.imgHeight = preloader.naturalHeight;
          };
        }
        this.CurrentImgUrl = loaded;
        return;
      }
      this.loading = true;
      this.$emit("progress", 0);
      this.axios
        .get(url, {
          responseType: "blob",
          onDownloadProgress: (event) => {
            this.$emit("progress", event.loaded / event.total);
          },
        })
        .then((response) => {
          this.$store.commit("Pic/setCacheImg", url);
          let uri = URL.createObjectURL(response.data);
          this.loadedList[this.CurrentPage - 1] = uri;
          let preloader = new Image();
          preloader.src = uri;
          preloader.onload = () => {
            this.imgWidth = preloader.naturalWidth;
            this.imgHeight = preloader.naturalHeight;
          };
          this.CurrentImgUrl = uri;
          this.loading = false;
          this.$emit("progress", 1);
        })
        .catch((error) => {
          console.error(error);
          if (error.response && error.response.status == 404) {
            this.$emit("forcefetch");
          }
          this.error(error.message);
          this.loading = false;
          this.$emit("progress", 1);
        });
    },
    loadUgoira() {
      this.loading = true;
      this.$emit("progress", 0);
      let url = this.calcUgoira(this.id, this.image, "original");
      this.axios
        .get(url, {
          responseType: "blob",
          onDownloadProgress: (event) => {
            this.$emit("progress", event.loaded / event.total);
          },
        })
        .then((response) => {
          this.$store.commit("Pic/setCacheImg", url);
          let file = new JSZip();
          file
            .loadAsync(response.data)
            .then(() => {
              Promise.all(
                this.ugoiraFrames.map((item) => {
                  return new Promise((resolve, reject) => {
                    file
                      .file(item["file"])
                      .async("blob")
                      .then((data) => {
                        this.ugoiraImages[item["file"]] =
                          URL.createObjectURL(data);
                        resolve();
                      })
                      .catch((error) => {
                        reject(error);
                      });
                  }).catch((error) => {
                    console.error(error);
                    this.error(error.message);
                    this.loading = false;
                    this.$emit("progress", 1);
                  });
                })
              ).then(() => {
                this.ugoiraPlay();
                this.loading = false;
              });
            })
            .catch((error) => {
              console.error(error);
              this.error(error.message);
              this.loading = false;
              this.$emit("progress", 1);
            });
        })
        .catch((error) => {
          console.error(error);
          if (error.response && error.response.status == 404) {
            this.$emit("forcefetch");
          }
          this.error(error.message);
          this.loading = false;
          this.$emit("progress", 1);
        });
    },
    ugoiraPlay() {
      let play = (nowIndex) => {
        let frameOption = this.ugoiraFrames[nowIndex];
        this.CurrentImgUrl = this.ugoiraImages[frameOption["file"]];
        this.$forceUpdate();
        if (nowIndex >= this.ugoiraFrames.length - 1) {
          nowIndex = 0;
        } else {
          nowIndex += 1;
        }
        setTimeout(() => {
          if (this.ugoiraPlaying == true) {
            window.requestAnimationFrame(() => {
              play(nowIndex);
            });
          }
        }, frameOption["delay"]);
      };
      if (!this.ugoiraPlaying) {
        this.ugoiraPlaying = true;
        play(0);
      }
    },
    error(message) {
      this.$buefy.notification.open({
        duration: 5000,
        message: message,
        type: "is-danger",
      });
    },
    containerResized(entry) {
      this.containerWidth = Math.floor(entry.contentRect.width);
    },
    windowResized() {
      this.windowHeight = document.documentElement.clientHeight;
      this.windowWidth = document.documentElement.clientWidth;
    },
    resizeImg() {
      var maxWidth = this.containerWidth;
      var maxHeight = this.windowHeight * this.MaxPercent;
      var oriWidth = this.imgWidth;
      var oriHeight = this.imgHeight;

      var minExpRatio;

      if (this.windowWidth < 790) {
        minExpRatio = maxWidth / oriWidth;

        this.width = oriWidth * minExpRatio;
        this.height = oriHeight * minExpRatio;

        return;
      }

      var whRatio = this.imgWidth / this.imgHeight;
      if (whRatio < 9 / 21) {
        minExpRatio = maxWidth / oriWidth / 2;

        this.width = oriWidth * minExpRatio;
        this.height = oriHeight * minExpRatio;

        return;
      }

      var heightExpRatio = maxHeight / oriHeight;
      var widthExpRatio = maxWidth / oriWidth;
      minExpRatio = Math.min(heightExpRatio, widthExpRatio);

      this.width = oriWidth * minExpRatio;
      this.height = oriHeight * minExpRatio;
    },
  },
};
</script>

<style lang="scss">
.onepx-blur {
  filter: blur(1px);
}
.presentation {
  margin: auto;
  padding: 0;

  .presentation-img {
    img {
      width: 100%;
      height: 100%;
      transition: all 0.6s ease-in-out;
    }
    position: relative;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.18);
    border: {
      radius: 10px;
    }
    @media screen and (max-width: 790px) {
      border: {
        top-left-radius: 0;
        top-right-radius: 0;
        bottom-left-radius: 3px;
        bottom-right-radius: 3px;
      }
    }
    overflow: hidden;
  }
}
</style>
