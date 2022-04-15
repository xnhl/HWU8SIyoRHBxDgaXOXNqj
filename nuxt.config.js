export default {
	target: 'static',
	loading: { color: 'transparent' },
	axios: { baseURL: '/' },
  modules: [
		'@nuxtjs/moment',
		'bootstrap-vue/nuxt',
		'@nuxtjs/color-mode',
		'@nuxtjs/style-resources'
	],
	colorMode: {
		preference: 'light',
		fallback: 'light',
		hid: 'nuxt-color-mode-script',
		globalName: '__NUXT_COLOR_MODE__',
		componentName: 'ColorScheme',
		classPrefix: '',
		classSuffix: '-mode',
		storageKey: 'nuxt-color-mode'
	},
	bootstrapVue: { icons: true },
	styleResources: { sass: [ './assets/*.sass' ] },
	generate: { routes: ["/"] },
  build: {
    extend (config, ctx) {},
    build: {
      postcss: {
        plugins: {
          'postcss-url': false,
          'postcss-nested': {},
          'postcss-responsive-type': {},
          'postcss-hexrgba': {}
        },
        preset: { autoprefixer: { grid: true } }
      }
    }
  }
}
