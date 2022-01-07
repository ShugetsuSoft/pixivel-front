<template>
  <section class="default-full-screen-top">
    <div class="container rank-form">
      <b-field>
        <!--"daily", "weekly", "monthly", "rookie", "original", "male", "female"-->
        <p class="control hide-c">
          <b-dropdown v-model="mode">
            <template #trigger>
              <b-button
                :label="rankLable[mode]"
                :type="'is-'+rankType[mode]"
                :icon-left="'uil uil-'+rankIcon[mode]"
                icon-right="uil uil-angle-down" />
            </template>
            <b-dropdown-item :value="val" v-for="(item, val) in rankLable" :key="val">
              <b-icon pack="uil" :icon="'uil-' + rankIcon[val]"></b-icon>
              <span>{{ item }}</span>
            </b-dropdown-item>
          </b-dropdown>
        </p>
        <b-radio-button v-model="mode" :native-value="val" :type="'is-' + rankType[val] + ' is-light is-outlined'" v-for="(item, val, index) in rankLable" :key="val" class="hide-p" :class="{'left-border-radius': index == 0}">
          <b-icon pack="uil" :icon="'uil-' + rankIcon[val]"></b-icon>
          <span>{{ item }}</span>
        </b-radio-button>
        <b-datepicker
          v-model="date"
          placeholder="输入一个日期或者选择一个~"
          icon-prev="uil uil-previous"
          icon-next="uil uil-step-forward"
          icon-right="uil uil-calender"
          :max-date="moment().subtract(2, 'days')._d"
          editable>
        </b-datepicker>
        <p class="control">
          <b-dropdown v-model="content">
            <template #trigger>
              <b-button
                :label="rankContent[content]"
                type="'is-light"
                icon-right="uil uil-angle-double-down" />
            </template>
            <b-dropdown-item :value="val" v-for="(item, val) in rankContent" :key="val">
              <span>{{ item }}</span>
            </b-dropdown-item>
          </b-dropdown>
        </p>
      </b-field>
    </div>
      <div class="container">
        <WaterFall :illusts="illusts" :identifier="loadid"/>
        <infinite-loading @infinite="illustsPageNext" spinner="spiral" :identifier="loadid" ref="infload">
          <div slot="no-more">加载完毕</div>
          <div slot="no-results">没结果</div>
          <div slot="error" slot-scope="{ trigger }">
            <div class="notification is-danger">
              <div class="buttons">
                <b-button type="is-primary" inverted @click="trigger">重试</b-button>
              </div>
              {{ errorMsg }}
            </div>
          </div>
        </infinite-loading>
      </div>
  </section>
</template>

<script>
import CONFIG from '@/config.json'
import WaterFall from '@/components/waterfall'

export default {
  name: "Rank",
  components: {
    WaterFall
  },
  data() {
    return {
      mode: 'daily',
      content: 'all',
      date: this.moment().subtract(2, 'days')._d,
      errorMsg: '',
      illusts: [],
      loadid: +new Date(),
      illustsPage: 0,
      rankLable: {'daily':'日榜','weekly':'周榜','monthly':'月榜','rookie':'新人榜','original':'原创榜','male':'男榜','female':'女榜'},
      rankType: {'daily':'primary','weekly':'success','monthly':'link','rookie':'warning','original':'light','male':'info','female':'danger'},
      rankIcon: {'daily':'sun','weekly':'calendar-alt','monthly':'moon','rookie':'newspaper','original':'images','male':'mars','female':'venus'},
      rankContent: {'all': '所有类型', 'illust': '仅插画', 'manga': '仅漫画', 'ugoira': '仅动图'},
    }
  },
  watch: {
    mode() {
      this.refresh()
    },
    content() {
      this.refresh()
    },
    date() {
      this.refresh()
    },
  },
  mounted() {
    setTimeout(() => {
      this.$refs.infload.attemptLoad()
    }, 500)
  },
  methods: {
    refresh() {
      this.illusts = []
      this.loadid += 1
      this.errorMsg = ''
      this.illustsPage = 0
      this.$store.commit('CancelRequests/clearCancelToken')
    },
    illustsPageNext($state) {
      let params = {
        "mode": this.mode,
        "content": this.content,
        "date": this.moment(this.date).format('YYYYMMDD'),
        "page": this.illustsPage,
      }
      this.axios
        .get(CONFIG.API_HOST + `rank/`,{
          params,
        }).then((response) => {
        if (response.data.error) {
          this.error(response.data.message)
          $state.error()
          return;
        }
        if (!response.data.data.has_next) {
          $state.complete()
        }
        this.illusts = this.illusts.concat(response.data.data.illusts)
        this.illustsPage += 1
        $state.loaded()
      }).catch((error)=>{
        this.error(error.response.data.message)
        $state.error()
      })
    },
    error(message) {
      this.$buefy.notification.open({
        duration: 5000,
        message: message,
        type: 'is-danger',
      })
      this.errorMsg = message
    }
  }
};
</script>

<style lang="scss">
.rank-form {
  padding: {
    top: 2rem;
    bottom: 2rem;
    left: 0.75rem;
    right: 0.75rem;
  };

  .left-border-radius {
    .button {
      border-top-left-radius: 6px !important;
      border-bottom-left-radius: 6px !important;
    }

  }

  .datepicker {
    width: fill-available;
  }

  @media screen and (max-width: 790px) {
    .hide-p {
      display: none;
    }
  }

  @media screen and (min-width: 790px) {
    .hide-c {
      display: none;
    }
  }
}
</style>