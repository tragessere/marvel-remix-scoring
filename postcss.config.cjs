module.export = {
	plugins: [
		require('postcss-preset-env')({
			autoprefixer: {
				flexbox: 'no-2009'
			},
			stage: 1,
			features: {
				'color-mod-function': true
			},
			importFrom: ['src/css/variables.css']
		}),
	]
}
