<template>
	<section class="section default-full-screen-top no-padding-phone" v-if="illust">
		<div class="container is-fluid no-padding-phone">
			<div class="columns">
				<div class="column is-three-quarters no-padding-phone">
					<Presentation :id="illust.id" :initial-width="illust.width" :initial-height="illust.height" :image="illust.image"
					 :page-count="illust.pageCount" />
				</div>
				<div class="column">
					<div class="container is-fluid no-padding-comp top-padding-phone img-info">
						<div class="content">
							<h1 class="title is-2 no-bottom-margin">{{ illust.title }}</h1>
							<small>{{ illust.altTitle }}</small>
							<hr>
							<v-clamp class="subtitle is-6 break-raw-text" autoresize :max-lines="5" tag="p">
								<template slot="default">{{ illust.description | htmlFilter }}</template>
								<template #after="{ toggle, expanded, clamped }">
									<b-tag type="is-success is-light" v-if="expanded || clamped" class="clickable-tag expand-tag-button" size="is-small"
									 @click.native="toggle">{{ expanded ? "收起" : "展开" }}</b-tag>
								</template>
							</v-clamp>
						</div>
						<b-taglist class="little-top-margin">
							<b-tag type="is-info is-light" class="clickable-tag" v-for="tag in illust.tags" :key="tag.name">{{ tag.name }} {{ tag.translation ? "|" : "" }} {{ tag.translation }}</b-tag>
						</b-taglist>

						<div class="media is-vertical-centered" @click="$router.push({'name': 'User', 'params': {'id': illust.user.id}})">
							<div class="media-left">
								<figure class="image is-64x64">
									<img :src="imgProxy(illust.user.image.url, id)" class="is-rounded full-hw">
								</figure>
							</div>
							<div>
								<h1 class="title is-4">{{ illust.user.name }}</h1>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
    <div class="container huge-top-margin">
      <WaterFall :illusts="recommendIllusts" :identifier="recommendIllustsIdentifier" />
      <infinite-loading @infinite="recommendIllustsPageNext" spinner="spiral">
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

	export default {
		name: "Detail",
		components: {
			Presentation,
			VClamp,
      WaterFall
		},
		data: () => ({
			id: 0,
			loading: null,
			illust: null,
      recommendIllusts: [],
      recommendIllustsPage: 0,
      recommendIllustsIdentifier: +new Date()
		}),
    watch: {
      $route() {
        this.id = this.$route.params.id
        this.loading = this.$buefy.loading.open()
        this.illust = null
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
</style>
