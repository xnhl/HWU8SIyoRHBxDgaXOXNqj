<template>
  <div id="wrapper">
		<div id="time-container">
			<div id="time" class="h3 p-4" v-text="time" :class="{ 'text-white': !colorMode, 'dark': !colorMode }"></div>
		</div>
		<div id="options">
			<input id="options-new" class="option p-2 m-2" :class="{ 'dark': !colorMode }" @keyup.enter="add" placeholder="What's next?">
			<div id="options-icons" class="option p-2 m-2" :class="{ 'dark': !colorMode }">
				<b-icon class="todo-icon h4 mb-0 mx-1" :class="{ 'text-white': !colorMode, 'hide': colorMode == true }" icon="sun" @click="changeTheme"></b-icon>
				<b-icon class="todo-icon h4 mb-0 mx-1" :class="{ 'text-white': !colorMode, 'hide': !colorMode }" icon="moon" @click="changeTheme"></b-icon>
				<b-icon class="todo-icon h4 mb-0 mx-1" :class="{ 'text-white': !colorMode }" icon="upload" @click="showDialog()"></b-icon>
				<b-icon class="todo-icon h4 mb-0 mx-1" :class="{ 'text-white': !colorMode }" icon="download" @click="save()"></b-icon>
				<b-icon class="todo-icon h4 mb-0 mx-1" :class="{ 'text-white': !colorMode }" icon="search" @click="toggleSearch()"></b-icon>
				<b-icon class="todo-icon h4 mb-0 mx-1" :class="{ 'text-white': !colorMode }" icon="trash" @click="remove()"></b-icon>
				<b-icon class="todo-icon h4 mb-0 mx-1" :class="{ 'text-white': !colorMode }" icon="sort-alpha-down" @click="sortAlpha()"></b-icon>
				<b-icon class="todo-icon h4 mb-0 mx-1" :class="{ 'text-white': !colorMode }" icon="sort-down" @click="sortLength()"></b-icon>
				<b-icon class="todo-icon h2 mb-0 mx-1" :class="{ 'text-white': !colorMode }" icon="check" @click="sortCompleted()"></b-icon>
			</div>
			<input id="options-load" class="hide" type="file" @change="loadFile" accept=".json, .txt" name="load">
		</div>
		<div id="search-container">
			<input id="search" class="p-2 m-2 hide" :class="{ 'dark': !colorMode, 'text-white': !colorMode }" @input="search()" @change="search()" placeholder="Search...">
		</div>
		<b-jumbotron id="jumbo" class="m-4 text-center" :class="{ 'dark': !colorMode, 'text-white': !colorMode, 'hide': hideJumbo }" header="To Do List" lead="Built with Vue, Vuex, Nuxt, and BootstrapVue.">
			<p>Sort, search, save / load (text, json), and drag to rearrange.</p>
			<b-button variant="secondary" href="#" @click="closeJumbo()">Close</b-button>
		</b-jumbotron>
		<div id="counts" v-if="hasTodos">
			<p id="counts-text" class="p-2 m-3 text-center" :class="{ 'text-white': !colorMode }" v-text="counts"></p>
			<div id="counts-bar">
				<div id="counts-bar-fill" :style="`width: ${countsPct}%`"></div>
			</div>
		</div>
		<draggable id="todos" class="m-2" v-model="list" @start="drag=true" @end="drag=false">
			<ToDo v-for="(todo, index) in todos" :key="`todo-${index}`" :info="todo" :mode="colorMode" />
		</draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
	components: { draggable },
	data() {
		return {
			time: `${this.$moment().format("LL")} ${this.$moment().format("LTS")}`,
			sortByAlpha: false,
			sortByLength: false,
			sortByCompleted: false,
			hideJumbo: false
		}
	},
	computed: {
		todos() { return this.$store.getters.all },
		hasTodos() { return this.$store.getters.total },
		counts() {
			let total = this.$store.getters.total
			let active = this.$store.getters.activeCount
			let done = this.$store.getters.completedCount
			return `${done} / ${total} done, ${active} remaining`
		},
		countsPct() {
			let total = this.$store.getters.total
			let done = this.$store.getters.completedCount
			return parseFloat((done / total) * 100)
		},
		colorMode() { return this.$nuxt.$colorMode.preference == "light" ? true : false },
		list: {
			get() { return this.$store.getters.all },
			set(value) { this.$store.dispatch('update', value) }
		}
	},
	methods: {
		changeTheme() {
			this.$nuxt.$colorMode.preference = this.$nuxt.$colorMode.preference == "light" ? "dark" : "light"
		},
		showDialog() {
			const fileInput = document.getElementById('options-load')
			fileInput.click()
		},
		toggleSearch() { 
			let search = document.getElementById("search")
			search.classList.toggle("hide")
		},
		add(e) {
			this.$store.dispatch('add', {text: e.target.value, timestamp: this.$moment().format("llll")})
			e.target.value = ''
		},
		remove() { this.$store.dispatch('removeCompleted') },
		closeJumbo() { this.hideJumbo = true },
		search() {
			setTimeout(() => {
				let val = document.getElementById("search").value
				let todo_elements = [...document.getElementsByClassName("todo")]
				let len = todo_elements.length
				for (let i = 0; i < len; i++) {
					let title = todo_elements[i].children[0].textContent
					let timestamp = todo_elements[i].children[1].textContent
					if (title.indexOf(val) > -1 || timestamp.indexOf(val) > -1) {
						todo_elements[i].classList.remove("hide")
					} else todo_elements[i].classList.add("hide")
				}
			}, 500)
		},
		sortAlpha() {
			if (this.sortByAlpha == true) {
				this.$store.dispatch('sortAlpha', true)
			} else { this.$store.dispatch('sortAlpha') }
			this.sortByAlpha = !this.sortByAlpha
		},
		sortLength() {
			if (this.sortByLength == true) {
				this.$store.dispatch('sortLength', true)
			} else { this.$store.dispatch('sortLength') }
			this.sortByLength = !this.sortByLength
		},
		sortCompleted() {
			if (this.sortByCompleted == true) {
				this.$store.dispatch('sortCompleted', true)
			} else { this.$store.dispatch('sortCompleted') }
			this.sortByCompleted = !this.sortByCompleted
		},
		save() {
			let FileSaver = require('file-saver')
			let stringed = JSON.stringify(this.todos)
			let blob = new Blob([stringed], {type: "application/json"})
			let mapped = this.todos.map(each => {
				let title = each.title.replace(/\r|\n/gi, "")
				return `${each.id}: ${each.timestamp}: ${each.completed == true ? "Complete" : "Incomplete"}: ${title}\r\n\r\n`
			})
			let blob_txt = new Blob(mapped, {type: "text/plain"})
			FileSaver.saveAs(blob, "todos.json")
			FileSaver.saveAs(blob_txt, "todos.txt")
		},
		saveJSON() {
			let FileSaver = require('file-saver')
			let stringed = JSON.stringify(this.todos)
			let blob = new Blob([stringed], {type: "application/json"})
			FileSaver.saveAs(blob, "todos.json")
		},
		saveText() {
			let FileSaver = require('file-saver')
			let stringed = this.todos.map(each => {
				let title = each.title.replace(/\r|\n/gi, "")
				let body = each.body.replace(/\r|\n/gi, "")
				let timestamp = each.timestamp
				return `${title} (${timestamp}) - ${body}\r\n\r\n`
			})
			let blob = new Blob(stringed, {type: "text/plain"})
			FileSaver.saveAs(blob, "todos.txt")
		},
		loadFile() {
			const fileInput = document.getElementById('options-load')
			const selectedFile = fileInput.files[0]
			let reader = new FileReader()
			if (selectedFile.name.indexOf("todos") > -1) {
				if (selectedFile.name.indexOf(".json") > -1) {
					reader.onload = (event) => {
						let response = JSON.parse(event.target.result)
						this.$store.dispatch('replace', response)
					}
				} else if (selectedFile.name.indexOf(".txt") > -1) {
					reader.onload = (event) => {
						let response = event.target.result
						let split = response.split("\r\n\r\n").map(each => {
							let split2 = each.split(": ")
							return {
								title: split2[3],
								id: split2[0],
								timestamp: split2[1],
								completed: split2[2] == "Complete" ? true : false
							}
						}).filter(each => each.title)
						this.$store.dispatch('replace', split)
					}
				}
				reader.readAsText(selectedFile)
			}
		}
	},
	created() {
		setInterval(() => { this.time = `${this.$moment().format("LL")} ${this.$moment().format("LTS")}` }, 1000)
	}
}
</script>

<style lang="sass">
#wrapper
	background: var(--color1)
	max-width: 90rem
	margin: 0 auto
	min-height: 100vh
	border-radius: 0.5rem
	@media (min-width: 90rem)
		margin: 2rem auto
	#new-todo
		min-width: 100%
		@include flexCenter
		position: sticky
		top: 0
		z-index: 2
		#new-todo-input
			width: 100%
			max-width: 30rem
			margin: 0 auto
			background: white
			border-radius: 0.5rem
	#time-container
		width: 100%
		@include flexCenter
		#time
			flex: 1
			max-width: 40rem
			margin: 0 auto
			@include flexCenter
			text-align: center
			border-radius: 0.5rem
	#options
		@include flexCenter
		align-items: stretch
		.option
			flex-basis: 25rem
			filter: drop-shadow(0 0 0.5rem rgba(black, 0.1)) drop-shadow(0 0 0.25rem rgba(black, 0.1))
			&.dark
				filter: drop-shadow(0 0 0.5rem rgba(white, 0.1)) drop-shadow(0 0 0.25rem rgba(white, 0.1))
		#options-icons
			@include flexCenter
			background: var(--color3)
			border-radius: 0.5rem
			.todo-icon
				flex: 1
				cursor: pointer
				border-radius: 50%
				&:hover
					transform: scale(1.25)
		#options-new
			border: 0
			border-radius: 0.5rem
			&.dark
				background: #111
				color: white
		#options-search
			border: 0
			border-radius: 0.5rem
		#options-load
	#counts
		width: 100%
		#counts-text
			font-size: 1.25rem
			line-height: 1.25rem
			@include flexCenter
		#counts-bar
			max-width: 23rem
			height: 1rem
			margin: 0.5rem auto
			overflow: hidden
			border-radius: 0.5rem
			background: desaturate(red, 66)
			#counts-bar-fill
				background: desaturate(green, 66)
				height: 1rem
	#search-container
		width: 100%
		@include flexCenter
		#search
			border: 0
			margin: 0 auto
			flex-basis: 25rem
			border-radius: 0.5rem
			filter: drop-shadow(0 0 0.5rem rgba(black, 0.1)) drop-shadow(0 0 0.25rem rgba(black, 0.1))
			&.dark
				background: #111
				filter: drop-shadow(0 0 0.5rem rgba(white, 0.1)) drop-shadow(0 0 0.25rem rgba(white, 0.1))
	#todos
		@include flexCenter
		align-items: stretch
		list-style-type: none
	#jumbo
		display: relative
		background-color: var(--color3)
		filter: drop-shadow(0 0 0.5rem rgba(black, 0.1)) drop-shadow(0 0 0.25rem rgba(black, 0.1))
		&.dark
			filter: drop-shadow(0 0 0.5rem rgba(white, 0.1)) drop-shadow(0 0 0.25rem rgba(white, 0.1))
		#jumbo-close
			display: absolute
			top: 0
			right: 0
			padding: 1rem
</style>
