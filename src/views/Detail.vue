<template>
	<section>
		
	</section>
</template>

<script>
	export default {
		name: "Detail",
		data: () => ({
			id: 0
		}),
		created() {
			this.id = this.$route.params.id
		}
	}
</script>

<style>
</style>
