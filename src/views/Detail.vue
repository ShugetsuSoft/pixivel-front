<template>
	<section class="section default-full-screen-top no-padding-phone">
		<div class="container is-fluid no-padding-phone">
			<div class="columns">
				<div class="column no-padding-phone">
					<Presentation :id="illust.id" :initial-width="illust.width" :initial-height="illust.height" :image="illust.image"
					 :page-count="illust.pageCount" v-if="illust"/>
				</div>
				<div class="column is-one-quarter">
					<div class="container is-fluid no-padding-comp top-padding-phone img-info">
						<div>
              <template v-if="illust">
							  <h1 class="title is-2 no-bottom-margin">{{ illust.title }}</h1>
							  <small>{{ illust.altTitle }}</small>
              </template>
              <template v-else>
                <b-skeleton width="20%" height="2rem"></b-skeleton>
                <b-skeleton width="40%" height=".875em"></b-skeleton>
              </template>
							<hr>
							<v-clamp class="subtitle is-6 break-raw-text" autoresize :max-lines="5" tag="p" v-if="illust">
								<template slot="default">{{ illust.description | htmlFilter }}</template>
								<template #after="{ toggle, expanded, clamped }">
									<b-tag type="is-success is-light" v-if="expanded || clamped" class="clickable-tag expand-tag-button" size="is-small"
									 @click.native="toggle">{{ expanded ? "收起" : "展开" }}</b-tag>
								</template>
							</v-clamp>
              <template v-else>
                <b-skeleton width="100%" height="15px" :count="3"></b-skeleton>
                <b-skeleton width="30%" height="15px"></b-skeleton>
              </template>
						</div>
						<b-taglist class="little-top-margin" v-if="illust">
              <template v-for="tag in illust.tags">
							  <b-tag type="is-info is-light" class="clickable-tag" :key="tag.name" @click.native="searchtag(tag.name)">{{ tag.name }}</b-tag>
                <b-tag type="is-link is-light" class="clickable-tag" v-if="tag.translation" :key="tag.translation+Math.random()" @click.native="searchtag(tag.translation)">{{ tag.translation }}</b-tag>
              </template>
						</b-taglist>
						<div class="media is-vertical-centered" @click="$router.push({'name': 'User', 'params': {'id': illust.user.id}})" v-if="illust">
							<div class="media-left">
								<figure class="image is-64x64">
									<img :src="imgProxy(illust.user.image.url, id)" class="is-rounded full-hw obj-cover">
								</figure>
							</div>
							<div>
								<h1 class="title is-4">{{ illust.user.name }}</h1>
							</div>
						</div>
            <HScroll :illusts="userIllusts" v-if="illust" @load="loadUserIllusts" :has-load="userIllustsShowLoading" ref="userIllusts"></HScroll>
            <div class="statistic" v-if="illust">
              <div class="statistic-item">
                <b-icon pack="uil" icon="uil-eye" size="is-small"></b-icon> {{ illust.statistic.views }}
              </div>
              <div class="statistic-item">
                <b-icon pack="uil" icon="uil-thumbs-up" size="is-small"></b-icon> {{ illust.statistic.likes }}
              </div>
              <div class="statistic-item">
                <b-icon pack="uil" icon="uil-heart" size="is-small"></b-icon> {{ illust.statistic.bookmarks }}
              </div>
              <div class="statistic-item">
                <b-icon pack="uil" icon="uil-comment" size="is-small"></b-icon> {{ illust.statistic.comments }}
              </div>
              <div class="content">{{ illust.createDate | dateFormat("LL") }}</div>
            </div>
					</div>
				</div>
			</div>
		</div>
    <div class="container huge-top-margin" v-if="illust">
      <WaterFall :illusts="recommendIllusts" :identifier="recommendIllustsIdentifier" />
      <infinite-loading @infinite="recommendIllustsPageNext" spinner="spiral" :identifier="recommendIllustsIdentifier">
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
	import Presentation from '@/components/presentation.vue'
	import CONFIG from '@/config.json'
	import VClamp from 'vue-clamp'
  import WaterFall from '@/components/waterfall'
  import HScroll from '@/components/horizontal_scroll'

	export default {
		name: "Detail",
		components: {
			Presentation,
			VClamp,
      WaterFall,
      HScroll
		},
		data: () => ({
			id: 0,
			loading: null,
			illust: null,
      recommendIllusts: [],
      recommendIllustsPage: 0,
      recommendIllustsIdentifier: +new Date(),
      userIllusts: [],
      userIllustsPage: 0,
      userIllustsLoading: false,
      userIllustsShowLoading: true
		}),
    watch: {
      $route() {
        this.id = this.$route.params.id
        this.loading = this.$buefy.loading.open()
        this.illust = null
        this.userIllusts = []
        this.userIllustsPage = 0
        this.userIllustsLoading = false
        this.load()
        this.refreshRecommend()
      }
    },
		created() {
			this.id = this.$route.params.id
			this.loading = this.$buefy.loading.open()
		},
		mounted() {
			this.load()
      this.refreshRecommend()
		},
		methods: {
			error(message) {
				this.$buefy.notification.open({
					duration: 5000,
					message: message,
					type: 'is-danger',
				})
			},
      load() {
        this.axios
          .get(CONFIG.API_HOST + `illust/${this.id}`)
          .then((response) => {
            if (response.data.error) {
              this.error(response.data.message)
              return;
            }
            this.illust = response.data.data
            this.loading.close()
          }).catch((error)=>{
          this.error(error.response.data.message)
          this.loading.close()
        })
      },
      loadUserIllusts() {
        if (this.userIllustsLoading == true) return
        this.userIllustsLoading = true
        this.axios
          .get(CONFIG.API_HOST + `user/${this.illust.user.id}/illusts`, {
            params: {
              page: this.userIllustsPage
            }
          })
          .then((response) => {
            if (response.data.error) {
              this.error(response.data.message)
              return;
            }
            if (!response.data.data.has_next) {
              this.userIllustsShowLoading = false
            }
            this.userIllusts = this.userIllusts.concat(response.data.data.illusts)
            if (this.userIllustsPage == 0) {
              this.$nextTick(() => {
                let targetIndex = this.Lodash.findIndex(this.userIllusts, item => {
                  return item.id == this.id
                })
                let leftDis = targetIndex * 184
                if (leftDis > this.$refs.userIllusts.$el.clientWidth / 2 - 92) {
                  leftDis -= this.$refs.userIllusts.$el.clientWidth / 2 - 92
                }
                this.$refs.userIllusts.scrollTo(leftDis)
              })
            }
            this.userIllustsPage += 1
            this.userIllustsLoading = false
          }).catch((error)=>{
          this.userIllustsLoading = false
          this.error(error.response.data.message)
        })
      },
      refreshRecommend() {
        this.recommendIllusts = []
        this.recommendIllustsPage = 0
        this.recommendIllustsIdentifier += 1
      },
      recommendIllustsPageNext($state) {
        this.axios
          .get(CONFIG.API_HOST + `illust/${this.id}/recommend`, {
            params: {
              page: this.recommendIllustsPage
            }
          })
          .then((response) => {
            if (response.data.error) {
              this.error(response.data.message)
              $state.error()
              return;
            }
            if (!response.data.data.has_next) {
              $state.complete()
            }
            this.recommendIllusts = this.recommendIllusts.concat(response.data.data.illusts)
            this.recommendIllustsPage += 1
            $state.loaded()
          }).catch((error)=>{
          this.error(error.response.data.message)
          $state.error()
        })
      },
      searchtag(name) {
        this.$router.push({ name: 'Search', params: { keyword: name }})
      }
		},
		filters: {
			htmlFilter: function(val) {
				return val.replace(/<br \/?>/g, "\r\n").replace(/<.*?>/g, "")
			}
		}
	}
</script>

<style lang="scss">
	.expand-tag-button {
		height: 1.25rem !important;

		margin: {
			left: 0.3rem;
		}
	}

  .statistic {
    margin: {
      top: 14px;
    }
    font-size: small;
    .statistic-item {
      display: inline-block;
      margin-right: 8px;
    }
  }

	@media screen and (max-width: 790px) {
		.section {
			padding: 0;
		}

		.no-padding-phone {
			padding: 0 !important;
		}

		.top-padding-phone {
			padding-top: 1.5rem;
		}

		.columns {
			margin: auto !important;
		}
	}

	@media screen and (min-width: 790px) {
		.no-padding-comp {
			padding: 0 !important;
		}

    .img-info {
      position: sticky;
      top: 2rem;
    }
	}

	.section {
		padding-top: 2rem;
	}
	
	.no-bottom-margin {
		margin-bottom: 0 !important;
	}
	
	.little-top-margin {
		margin-top: 1rem !important;
	}

  .huge-top-margin {
    margin-top: 5rem;
  }

  .is-vertical-centered {
    align-items: center !important;
  }

  .obj-cover {
    object-fit: cover;
  }
</style>
