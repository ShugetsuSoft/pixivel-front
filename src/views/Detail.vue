<template>
	<section class="section default-full-screen-top no-padding-phone">
		<div class="container is-fluid no-padding-phone" v-if="illust">
			<div class="columns">
				<div class="column is-three-quarters no-padding-phone">
					<Presentation :id="illust.id" :initial-width="illust.width" :initial-height="illust.height" :image="illust.image"
					 :page-count="illust.pageCount" />
				</div>
				<div class="column">
					<div class="container is-fluid no-padding-comp top-padding-phone">
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
									<img :src="imgProxy(illust.user.image.url)" class="is-rounded full-hw">
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
	</section>
</template>

<script>
	import Presentation from '@/components/presentation.vue'
	import CONFIG from '@/config.json'
	import VClamp from 'vue-clamp'

	export default {
		name: "Detail",
		components: {
			Presentation,
			VClamp
		},
		data: () => ({
			id: 0,
			current: 1,
			loading: null,
			illust: null
		}),
		created() {
			this.id = this.$route.params.id
			this.loading = this.$buefy.loading.open()
		},
		mounted() {
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
		methods: {
			error(message) {
				this.$buefy.notification.open({
					duration: 5000,
					message: message,
					type: 'is-danger',
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
</style>
