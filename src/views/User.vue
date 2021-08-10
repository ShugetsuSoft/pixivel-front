<template>
	<section class="default-full-screen-top" v-if="user">
		<section class="hero user-banner is-medium">
			<LoadImg :src="user.image.background ? user.image.background : ''" />
		</section>
		<section class="hero profile">
			<div class="hero-body container is-widescreen">
				<figure class="image profile-ava is-rounded">
					<LoadImg :src="user.image.bigUrl" class="full-hw" />
				</figure>

				<h1 class="title is-2 has-text-centered">
					{{ user.name }}
				</h1>
				<hr>
				<p class="subtitle is-6 break-raw-text">
					{{ user.bio }}
				</p>
			</div>
		</section>
		<div class="container">
			<WaterFall :illusts="userIllusts" />
			<infinite-loading @infinite="illustsPageNext" spinner="spiral">
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
	import LoadImg from '@/components/load_img.vue'

	export default {
		name: 'User',
		components: {
			WaterFall,
			LoadImg
		},
		data() {
			return {
				id: 0,
				loading: null,
				user: null,
				userIllusts: [],
				illustsPage: 0
			}
		},
		created() {
			this.id = this.$route.params.id
			this.loading = this.$buefy.loading.open()
		},
		mounted() {
			this.axios
				.get(CONFIG.API_HOST + `user/${this.id}`)
				.then((response) => {
					if (response.data.error) {
						this.error(response.data.message)
						return;
					}
					this.user = response.data.data
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
			},
			illustsPageNext($state) {
				this.axios
					.get(CONFIG.API_HOST + `user/${this.id}/illusts`, {
						params: {
							page: this.illustsPage
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
						this.userIllusts = this.userIllusts.concat(response.data.data.illusts)
						this.illustsPage += 1
						$state.loaded()
					})
			}
		},
	}
</script>

<style lang="scss">
	.user-banner {
		height: 15rem;
	}
	
	.profile {
		box-shadow: 1px -8px 8px rgba(0, 0, 0, .175);
		
		.profile-ava {
			height: 150px;
			width: 150px;
			margin-top: -8rem;
			margin-left: auto;
			margin-right: auto;
			margin-bottom: 2rem;
			overflow: hidden;
			
			.lazyimg {
				box-shadow: 0 0 8px rgba(0, 0, 0, .175);
			}
		}
	}
</style>
