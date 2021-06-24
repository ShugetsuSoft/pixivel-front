<template>
	<div class="hidden">
		<vs-sidebar reduce v-model="active" open id = "vs-sidebar-content">
			<vs-sidebar-item id="/rank">
				<template #icon>
					<i class='bx bx-grid-alt'></i>
				</template>
				排行榜
			</vs-sidebar-item>
			<vs-sidebar-item id="/search">
				<template #icon>
					<i class='bx bx-search'></i>
				</template>
				搜索
			</vs-sidebar-item>
			<vs-sidebar-item id="/">
				<template #icon>
					<img class="logo" src="@/assets/favicon.png" />
				</template>
				首页
			</vs-sidebar-item>
			<vs-sidebar-item @click.native="$router.back()">
				<template #icon>
					<i class='bx bx-arrow-back'></i>
				</template>
				退后
			</vs-sidebar-item>
			<vs-sidebar-item @click.native="$router.forward()">
				<template #icon>
					<i class='bx bx-arrow-back' style="transform: rotate(180deg);"></i>
				</template>
				前进
			</vs-sidebar-item>
		</vs-sidebar>
	</div>
</template>

<script>
	export default {
		name: "Nav",
		watch: {
			'active': 'route',
			'$route': "router"
		},
		data: () => ({
			active: '/'
		}),
		methods: {
			route(val) {
				if (val != this.$route.path)
					this.$router.push(val);
			},
			router() {
				if (this.active != this.$route.path)
					this.active = this.$route.path;
			}
		},
		created() {
			this.active = this.$route.path
		}
	}
</script>

<style lang="scss">
	.vs-sidebar__item__text {
		display: none;
	}

	.vs-sidebar__item__icon {
		background: transparent !important;
	}

	.logo {
		max-width: 35px !important;
		max-height: 35px;
	}
	
	#vs-sidebar-content {
	    position: fixed;
	    left: 30px;
	    bottom: 20px;
	    max-width: 260px;
	    border-radius: 30px;
	    color: rgba(var(--vs-text), 1);
	    box-shadow: 0 5px 20px 0 rgba(0,0,0,var(--vs-shadow-opacity));
	    display: -webkit-box;
	    -webkit-box-align: start;
	    align-items: flex-start;
	    -webkit-box-pack: justify;
	    justify-content: space-between;
	    -webkit-box-orient: vertical;
	    -webkit-box-direction: normal;
	    flex-direction: column;
	    z-index: 21000;
	    background: rgba(var(--vs-background), 1);
	    transition: none;
		height: auto;
		top: auto;
	}
	
	.vs-sidebar__item:after {
		content: none !important;
	}
</style>
