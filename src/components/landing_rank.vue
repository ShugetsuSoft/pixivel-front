<template>
	<div class="cards-group rank-horizontal-list">
		<div class="list-item" v-for="i in 8" :key="i">
			
		</div>
	</div>
</template>

<script>
	export default {
		name: "LandingRank"
	}
</script>

<style lang="scss">
	.cards-group {
		margin: 3rem;
	}

	.rank-horizontal-list {
		padding: 0;
		margin: 0;
		display: flex;
		overflow-x: scroll;
		overflow-y: hidden;
		white-space: nowrap;
		width: 100%;
		scroll-behavior: smooth;
	}
</style>
