<template>
	<nav class="columns pagination">
		<div class="column">
			<div class="level-item">
				<div class="title is-6 clickable-text" @click="back()" v-show="isNotFirst">
					<b-icon icon="chevron-left" size="is-small"></b-icon>Back
				</div>
			</div>
		</div>
		<div class="column">
			<p class="level-item has-text-centered">
				{{ current }} / {{ maxPage }}
			</p>
		</div>
		<div class="column">
			<div class="level-item">
				<div class="title is-6 clickable-text" @click="forward()" v-show="isNotLeast">Forward<b-icon icon="chevron-right"
					 size="is-small"></b-icon>
				</div>
			</div>
		</div>
	</nav>
</template>

<script>
	export default {
		name: "Pagination",
		props: {
			value: [String, Number],
			"max-page": Number,
		},
		model: {
			prop: 'value',
			event: 'input'
		},
		data() {
			return {
				current: 1
			}
		},
		created() {

		},
		mounted() {

		},
		computed: {
			isNotFirst() {
				return this.current > 1
			},
			isNotLeast() {
				return this.current < this.maxPage
			}
		},
		methods: {
			pageChange() {
				this.$emit('input', this.current)
			},
			back() {
				this.current--
				this.pageChange()
			},
			forward() {
				this.current++
				this.pageChange()
			}
		}
	};
</script>

<style lang="scss">
	.pagination {
		margin-top: 0.1rem;

		.clickable-text {
			user-select: none !important;
			transition: color .1s ease-in-out;

			&:hover {
				color: #b5b5b5;
				cursor: pointer;
			}
		}

		.with-width {
			width: 1rem;
		}
	}
</style>
