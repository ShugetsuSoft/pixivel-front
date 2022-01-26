<template>
  <section>
    <section class="hero is-primary is-fullheight">
      <div class="background thenshow">
        <Shapes />
      </div>
      <div class="hero-body">
        <div class="content container has-text-centered">
          <h1 class="title-1">
            <b><b>飞花拈叶笑谈中，</b><b>复来春旦重瓣红；</b></b>
            <b><b>又岁不弃拜宾恩，</b><b>嫁娘新妆莫识生。</b></b>
          </h1>
          <h1 class="title-2">
            Pixivel 2.0
          </h1>
        </div>
      </div>
      <div class="hero-foot">
        <b-icon
          pack="uil"
          icon="uil-angle-down"
          size="is-large">
        </b-icon>
        向下滑动
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h1 class="title"><b>Pixivel 2.0</b> —— “Bane/バネ/春”</h1>
        <h2 class="subtitle">
          春天是一个充满希望的季节，也是我们羽翼未丰的Pixivel继续成长的又一年的开端。<br>
          她在冬天里慢慢积蓄营养，一点一点出落的愈发漂亮，最终在这早春之时，在冰雪之间，在地下深厚的温暖之势下怒放。<br>
          春天真的要来了。<br>
          “飞花拈叶笑谈中，复来春旦重瓣红；<br>
          又岁不弃拜宾恩，嫁娘新妆莫识生。”<br>
          Pixivel 2.0， “Bane/バネ/春”，在樱花树下，与你相见。
        </h2>
        <b-button type="is-info" icon-right="uil uil-angle-right-b" @click.native="$router.push({'name': 'Landing'})">
          点击进入新世界
        </b-button>
      </div>
    </section>
  </section>
</template>

<script>
import Shapes from "@/components/shapes";

export default {
  name: "Welcome",
  components: {
    Shapes
  },
};
</script>

<style lang="scss">
.hero {
  position: relative;
}
.background {
  &:before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 0;

    background: {
      attachment: fixed;
      image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAADAQMAAACDJEzCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAGUExURQAAAEdwTIDnVscAAAACdFJOUzMAgvioCAAAAA5JREFUCNdjOMBwgIEBAAYGAYE538a8AAAAAElFTkSuQmCC);
    }
  }
}
.hero-body {
  padding-bottom: 0;
  padding-top: 5rem;
}
.hero-foot {
  text-align: center;
  animation-fill-mode: forwards;
  animation-delay: 13s;
  opacity: 0;
  animation-duration: 1s;
  animation-name: show;
  animation-iteration-count: initial;
  animation-direction: normal;
  animation-timing-function: ease-in-out;
}
@keyframes slidein {
  0% {
    margin-bottom: -40px;
    opacity: 0;
  }

  50% {
    margin-bottom: 0;
    opacity: 1;
  }

  100% {
    -webkit-mask-position: 100%;
    margin-top: -40px;
    opacity: 0;
  }
}
.thenshow {
  animation-fill-mode: forwards;
  animation-delay: 12s;
  opacity: 0;
  animation-duration: 1s;
  animation-name: show;
  animation-iteration-count: initial;
  animation-direction: normal;
  animation-timing-function: ease-in-out;
}
  .title-1 {
    margin-bottom: 0;
    opacity: 0;
    height: 0;
    animation-duration: 7s;
    margin-top: -40px;
    animation-name: slidein;
    animation-iteration-count: initial;
    animation-direction: normal;
    animation-timing-function: ease-in-out;
    b {
      display: inline-block;
      height: 0;
    }
  }
@keyframes show {
  from {
    height: auto;
    opacity: 0;
  }
  to {
    height: auto;
    opacity: 1;
  }
}
  .title-2 {
    animation-fill-mode: forwards;
    animation-delay: 7.5s;
    opacity: 0;
    height: 0;
    overflow: hidden;
    animation-duration: 3s;
    animation-name: show;
    animation-iteration-count: initial;
    animation-direction: normal;
    animation-timing-function: ease-in-out;
    font-size: 5rem !important;
  }
</style>