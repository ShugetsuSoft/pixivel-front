<template>
  <section>
    <div
      class="background"
      :style="{ 'background-image': `url(${backgroundImg})` }"
    ></div>
    <div class="container landing-info">
      <div class="columns">
        <div class="column is-two-thirds">
          <div class="notification">
            <h2>排行榜</h2>
            <HScroll :illusts="rankIllusts" @load="loadRankIllusts" :has-load="rankIllustsContinue" ref="userIllusts"></HScroll>
          </div>
        </div>
        <div class="column">
          <div class="notification">
            <h2>推荐画师</h2>
            <UserList :users='[{"id":3806145,"name":"[みゅとん]뮤우톤","bio":"フリーイラストレータをやっております。\r\n仕事では「みゅとん」または「뮤우톤」で活動してます。\r\nブクマ,コメントいつもありがとうございます!力になります!\r\n\r\n※お仕事のご依頼について\r\n\r\n何かございましたらメールにご連絡ください。\r\nメールの住所は以下を参考くださいませ。\r\n確認が遅くなり返事が遅くなることはあります。\r\nR18と個人依頼は受け取りしないのでよろしくお願いします。\r\n\r\n日本語の会話可能ですので負担なさらずメール下さい\r\n\r\n*よく受ける質問について*\r\nイメージのアイコン,プロフィルとしては自由にお使いください。ただしユーチューブなどの商業的な用度,他イラストサイトへの再アップロードは禁じておりますのでよろしくお願いいたします。\r\n\r\n「メール」myuton0407@gmail.com\r\n「ツイッター」https://twitter.com/myuton0407\r\n\r\n-2020.02.14.-\r\n\r\n-------------------------------------------------------\r\n\r\n프리 일러스트레이터로 활동중입니다.\r\n상업에서는 「みゅとん」또는「뮤우톤」으로 활동하고 있습니다.\r\n북마크,덧글 언제나 감사합니다! 힘이 됩니다!\r\n\r\n※일의 의뢰에 대해서\r\n\r\n무슨 일이 있으시면 메일로 연락 주세요.\r\n이메일 주소는 아래를 참고해 주시기 바랍니다.\r\n확인이 늦어져 답장이 늦을 수 있습니다.\r\nR18과 개인 의뢰는 받지 않으므로 그 점은 잘 부탁 드립니다.\r\n\r\n부담갖지말고 메일주세요.\r\n\r\n*자주 묻는 질문에 관하여*\r\n이미지의 아이콘, 프로필로서의 사용은 자유입니다. 다만 유투브 등의 상업적 용도, 타 일러스트 사이트의 재 업로드는 금지하고 있으므로 모쪼록 잘 부탁드립니다.\r\n\r\n「메일」myuton0407@gmail.com\r\n「트위터」https://twitter.com/myuton0407\r\n\r\n\r\n-2020.02.14.-","image":{"url":"https://i.pximg.net/user-profile/img/2020/06/29/07/36/07/18904817_74067a34869e0b6603aba69d1301bff3_50.jpg","bigUrl":"https://i.pximg.net/user-profile/img/2020/06/29/07/36/07/18904817_74067a34869e0b6603aba69d1301bff3_170.jpg"}}]'></UserList>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <WaterFall :illusts="sampleIllusts" :identifier="loadid"/>
      <infinite-loading @infinite="sampleIllustsPageNext" spinner="spiral" :identifier="loadid" ref="infload">
        <div slot="no-more">加载完毕</div>
        <div slot="no-results">没结果</div>
        <div slot="error" slot-scope="{ trigger }">
          <div class="notification is-danger">
            <div class="buttons">
              <b-button type="is-primary" inverted @click="trigger">重试</b-button>
            </div>
          </div>
        </div>
      </infinite-loading>
    </div>
  </section>
</template>

<script>
import CONFIG from '@/config.json'
import WaterFall from '@/components/waterfall'
import HScroll from '@/components/horizontal_scroll'
import UserList from '@/components/user_list'

export default {
  name: "Landing",
  components: {
    WaterFall,
    HScroll,
    UserList
  },
  data() {
    return {
      backgroundImg: "https://api.daihan.top/api/acg",
      sampleIllusts: [],
      loadid: +new Date(),
      rankIllustsContinue: true,
      rankIllusts: [],
      rankIllustsPage: 0
    };
  },
  computed: {
  },
  methods: {
    sampleIllustsPageNext($state) {
      let params = {
        "t": +new Date(),
        "quality": this.$store.getters["Settings/get"]("sample.quality")
      }

      this.axios
        .get(CONFIG.API_HOST + `illusts/sample`, {
          params
        }).then((response) => {
        if (response.data.error) {
          this.error(response.data.message)
          $state.error()
          return;
        }
        this.sampleIllusts = this.sampleIllusts.concat(response.data.data.illusts)
        $state.loaded()
      }).catch((error)=>{
        this.error(error.response.data.message)
        $state.error()
      })
    },
    loadRankIllusts() {
      let params = {
        "mode": "daily",
        "content": "all",
        "date": this.moment().subtract(1, 'days').format('YYYYMMDD'),
        "page": this.rankIllustsPage,
      }
      this.axios
        .get(CONFIG.API_HOST + `rank/`,{
          params,
        }).then((response) => {
        if (response.data.error) {
          this.error(response.data.message)
          return;
        }
        if (!response.data.data.has_next) {
          this.rankIllustsContinue = false
        }
        this.rankIllusts = this.rankIllusts.concat(response.data.data.illusts)
        this.rankIllustsPage += 1
      }).catch((error)=>{
        this.error(error.message)
      })
    },
    error(message) {
      this.$buefy.notification.open({
        duration: 5000,
        message: message,
        type: 'is-danger',
      })
    }
  }
};
</script>

<style lang="scss">
.background {
  position: relative;
  height: calc(100vh + 6rem);

  background: {
    attachment: scroll;
    repeat: no-repeat;
    position: 50%;
    size: cover;
  }

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

.landing-info {
  margin: {
    top: -2rem;
    bottom: 2rem;
  }
  .userlist {
    height: 187px;
  }
  .notification {
    padding: {
      top: 1.25rem;
      bottom: 1.25rem;
      left: 1.5rem;
      right: 1.5rem;
    }
  }
}
</style>
