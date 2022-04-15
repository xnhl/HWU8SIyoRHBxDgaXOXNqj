<template>
	<li class="todo p-1 m-3" :class="{ 'text-white': !mode, 'dark': !mode, 'done': info.completed }">
		<span class="todo-text m-2" v-text="info.title"></span>
		<div class="todo-timestamp" v-text="info.timestamp"></div>
		<div class="todo-icons">
			<input class="todo-check m-2" :checked="info.completed" @change="toggle()" type="checkbox">
			<div class="todo-icon-wrapper p-2">
				<b-icon @click="remove()" class="todo-icon mb-0" :class="{ 'text-white': !mode }" icon="trash"></b-icon>
			</div>
		</div>
	</li>
</template>

<script>
export default {
	props: { info: {}, mode: null },
	methods: {
		remove(){ this.$store.dispatch('remove', this.info) },
		toggle(){ this.$store.dispatch('toggle', this.info) }
	}
}
</script>

<style lang="sass">
.todo
	flex: 1
	flex-basis: 20rem
	cursor: pointer
	display: flex
	flex-direction: column
	align-items: center
	background: var(--color2)
	border-radius: 0.5rem
	transition: filter 0.2s ease-in-out
	filter: drop-shadow(0 0 0.5rem rgba(black, 0.15)) drop-shadow(0 0 0.25rem rgba(black, 0.15))
	&:hover
		filter: drop-shadow(0 0 0.66rem rgba(black, 0.15)) drop-shadow(0 0 0.66rem rgba(black, 0.15))
	&.dark
		filter: drop-shadow(0 0 0.5rem rgba(white, 0.15)) drop-shadow(0 0 0.25rem rgba(white, 0.15))
		&:hover
			filter: drop-shadow(0 0 0.66rem rgba(white, 0.15)) drop-shadow(0 0 0.66rem rgba(white, 0.15))
	.todo-text
		flex: 1
		padding: 1rem
		font-size: 1.1rem
		line-height: 1.1rem
		@include flexCenter
	.todo-timestamp
		font-size: 0.75rem
		line-height: 0.75rem
	.todo-icons
		width: 100%
		@include flexCenter
		justify-content: space-between
		.todo-check
		.todo-icon-wrapper
			.todo-icon
	@media (min-width: 50rem)
		max-width: 50rem
.done
	text-decoration: line-through
	opacity: 0.25
	filter: drop-shadow(0 0 0 rgba(black, 0))
	&:hover
		filter: drop-shadow(0 0 0 rgba(black, 0))
	&.dark
		filter: drop-shadow(0 0 0 rgba(black, 0))
		&:hover
			filter: drop-shadow(0 0 0 rgba(black, 0))
</style>
